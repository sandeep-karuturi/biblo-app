const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rohith@3047', // <--- CHANGE THIS!
    database: 'biblo_db'
});

db.connect(err => {
    if (err) console.log("❌ Database Connection Failed: " + err);
    else console.log("✅ Connected to MySQL");
});

// --- API ROUTES ---

// 1. GET ALL BOOKS (For Home Page)
app.get('/books', (req, res) => {
    // We join the 'users' table to replace 'owner_id' with the actual 'username'
    const sql = `
        SELECT books.*, users.username AS owner_name 
        FROM books 
        JOIN users ON books.owner_id = users.id
        WHERE books.is_available = 1
    `;

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});
// 2. LOGIN (For Auth Page)
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error");
        if (data.length > 0) {
            return res.json({ Status: "Success", user: data[0] });
        } else {
            return res.json({ Status: "Failed", Message: "Wrong email/password" });
        }
    });
});
// --- USER REGISTRATION ---
app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`username`, `email`, `password`, `city`) VALUES (?)";
    const values = [
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.city
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.json({ Status: "Failed", Error: err });
        }
        return res.json({ Status: "Success" });
    });
});

// 3. ADD BOOK (For Add Book Page)
// 3. ADD BOOK (Updated for Images)
app.post('/books', (req, res) => {
    // Note we added `cover_pic` to the query
    const sql = "INSERT INTO books (`title`, `author`, `location`, `cover_pic`, `owner_id`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.author,
        req.body.location,
        req.body.cover_pic, // <--- New Field
        req.body.owner_id || 1
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err); // Log error to terminal so you can see it
            return res.status(500).json(err);
        }
        return res.json("Book Added");
    });
});
app.post('/swap', (req, res) => {
    const { book_id, requester_id, owner_id } = req.body;

    const sql = "INSERT INTO swap_requests (`book_id`, `requester_id`, `owner_id`) VALUES (?)";
    const values = [book_id, requester_id, owner_id];

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json({ Status: "Success", Message: "Swap request sent!" });
    });
});

// --- GET INCOMING REQUESTS (For the "My Swaps" Page) ---
app.get('/swaps', (req, res) => {
    const userId = req.query.user_id; // We will pass the logged-in user's ID

    // Complex Query: Get the Swap Request + Book Details + Requester's Name
    const sql = `
        SELECT r.id, r.status, b.title, u.username AS requester_name 
        FROM swap_requests r
        JOIN books b ON r.book_id = b.id
        JOIN users u ON r.requester_id = u.id
        WHERE r.owner_id = ?
    `;

    db.query(sql, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// --- UPDATE SWAP STATUS (Accept/Reject) ---
// --- UPDATE SWAP STATUS & HIDE BOOK ---
// --- UPDATE SWAP STATUS & HIDE BOOK ---
app.put('/swaps', (req, res) => {
    const { id, status } = req.body; // id is the swap_request_id

    // 1. First, find out which book is linked to this swap
    const getBookSql = "SELECT book_id FROM swap_requests WHERE id = ?";

    db.query(getBookSql, [id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.json({ Error: "Swap request not found" });

        const bookId = data[0].book_id;

        // 2. Update the Swap Request Status
        const updateSwapSql = "UPDATE swap_requests SET status = ? WHERE id = ?";
        db.query(updateSwapSql, [status, id], (err) => {
            if (err) return res.json(err);

            // 3. IF ACCEPTED -> Mark Book as Unavailable (is_available = 0)
            if (status === 'Accepted') {
                const hideBookSql = "UPDATE books SET is_available = 0 WHERE id = ?";
                db.query(hideBookSql, [bookId], (err) => {
                    if (err) return res.json(err);
                    return res.json({ Status: "Success", Message: "Swap Accepted & Book Hidden" });
                });
            } else {
                // If rejected, just return success (Book stays available)
                return res.json({ Status: "Success", Message: "Swap Rejected" });
            }
        });
    });
});

// --- DELETE BOOK (And its history) ---
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;

    // 1. First, delete any swap requests for this book (Cleanup)
    const sqlCleanup = "DELETE FROM swap_requests WHERE book_id = ?";

    db.query(sqlCleanup, [bookId], (err) => {
        if (err) {
            console.error("Cleanup Error:", err);
            return res.json(err);
        }

        // 2. Now it is safe to delete the Book
        const sqlDeleteBook = "DELETE FROM books WHERE id = ?";
        db.query(sqlDeleteBook, [bookId], (err, result) => {
            if (err) {
                console.error("Delete Book Error:", err);
                return res.json(err);
            }
            return res.json({ Status: "Success" });
        });
    });
});
// Start the Server
app.listen(8081, () => {
    console.log("🚀 Backend running on port 8081");
});