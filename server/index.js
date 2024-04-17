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
    origin: ['http://localhost:5173', 'https://x-twitter-lilac.vercel.app', 'https://xtwitter.praveensingh.in'],
    credentials: true
  }

// using middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/api/', userRouter);


// app.listen(PORT, () => {
//     connectDB();
//     console.log(`server listening at port ${PORT}`)
// })

//Connect to the database before listening // for serverless deployment (cyclic.sh)
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`listening for requests at port ${PORT}`);
  })
})