import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app,server } from "./lib/socket.js"
dotenv.config()

const PORT=process.env.PORT

// Allow slightly more than 5MB to account for base64 expansion (~33%)
app.use(express.json({ limit: "6mb" }))
app.use(express.urlencoded({ limit: "6mb", extended: true }))
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
server.listen(PORT,()=>{
    console.log(`live on port ${PORT}`);
    connectDB();
    
})