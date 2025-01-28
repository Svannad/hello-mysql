// Imports
import express from "express";
import cors from "cors";
import db from "./database.js";

// ========== Setup ========== //

// Create Express app
const server = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
server.use(express.json()); // to parse JSON bodies
server.use(cors()); // Enable CORS for all routes

// ========== Routes ========== //

// Root route
server.get("/", async (req, res) => {
    // Check database connection
    const result = await db.ping();

    if (result) {
        res.send("Node.js REST API with Express.js - connected to database ✨");
    } else {
        res.status(500).send("Error connecting to database");
    }
});

server.get("/users", async (req, res) => {
    const query = "SELECT * FROM users"
    const [users] = await db.execute(query)
    res.json(users)
})

server.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM users WHERE id = ?"
    const values = [id]
    const [users] = await db.execute(query, values)
    res.json(users[0])
})

server.post("/users", async (req, res) => {
    const user = req.body
    const query = "INSERT INTO users (name, mail, title, image) VALUES (?, ?, ?, ?)"
    const values =[ user.name, user.mail, user.title, user.image]
    const [result] = await db.execute(query, values)
    res.json(result)
})

server.put("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = req.body
    console.log(user)
    const query = "UPDATE users SET name=?, mail=?, title=?, image=? WHERE id=?"
    const values = [user.name, user.mail, user.title, user.image, id]
    const [result] = await db.execute(query, values)
    res.json(result)
})

server.delete("/users/:id", async (req, res) => {
    const id = req.params.id
    const query = "DELETE FROM users WHERE id = ?"
    const values = [id]
    const [reslut] = await db.execute(query, values)
    res.json(reslut)
})

// Start server on port 3000
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
