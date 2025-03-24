const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const MY_SECRET_TOKEN = "3b9cb5c62435c276dbd2502f75021efafff891db92401765e836edee5e97f800";
const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

// Register API
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
    const dbUser = await db.get(selectUserQuery, [username]);

    if (dbUser) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await db.run(createUserQuery, [username, email, hashedPassword]);

    res.status(201).send("User created successfully");
});

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
    const dbUser = await db.get(selectUserQuery, [username]);

    if (!dbUser) {
        return res.status(400).send("Invalid User");
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
        const jwtToken = jwt.sign({ username }, MY_SECRET_TOKEN);
        res.send({ jwtToken });
    } else {
        res.status(400).send("Invalid Password");
    }
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "User not logged in" });

    jwt.verify(token, MY_SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

