import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const PORT = process.env.PORT
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Allow slightly more than 5MB to account for base64 expansion (~33%)
app.use(express.json({ limit: "6mb" }))
app.use(express.urlencoded({ limit: "6mb", extended: true }))
app.use(cookieParser())

// CORS: allow localhost in dev, not needed in production (same origin)
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }))
}

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "../../frontend/dist")
    app.use(express.static(frontendDist))
    // Catch-all: send index.html for any non-API route (React Router support)
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"))
    })
}

server.listen(PORT, () => {
    console.log(`live on port ${PORT}`)
    connectDB()
})

//changes env to production