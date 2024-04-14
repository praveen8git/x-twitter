import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/database.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";

const { PORT } = process.env;

const app = express();


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  }

// using middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/api/', userRouter);


app.listen(PORT, () => {
    connectDB();
    console.log(`server listening at port ${PORT}`)
})