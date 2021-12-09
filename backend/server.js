const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const postRouter = require("./routers/postRoutes");
const userRouter = require("./routers/userRoutes");
const homeRouter = require("./routers/homeRoutes");
const conversationRouter = require("./routers/conversationRoutes");
const messageRouter = require("./routers/messageRoutes");
const commentRouter = require("./routers/commentRoutes");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fs = require("fs");

//Configuration
dotenv.config({ path: "./config.env" });
const app = express();
const DB =
  process.env.DATABASE_LOCAL ||
  process.env.DATABASE_URL.replace(
    "<username>",
    process.env.DATABASE_USERNAME
  ).replace("<password>", process.env.DATABASE_PASSWORD);

const port = process.env.PORT * 1 || 8080;
const server = http.createServer(app);

app.use(express.json());

//cors configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);

  if (res.method === "OPTION") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
  }
  next();
});
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser()); //req.cookies

//Setting jwt cookie to headers Authorization bearer token
app.use((req, res, next) => {
  if (req.cookies.jwt) req.headers.Authorization = `Bearer ${req.cookies.jwt}`;
  next();
});

//Routes
app.use("/posts", postRouter);
app.use("/comment", commentRouter);
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/", homeRouter);
// app.use(express.static(`${__dirname}/public`));

//////////////////////
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`App server is Running on port ${port}`);
});
