// const jwt = require("jsonwebtoken");
// const jwtSecret = "mysuperdupersecret";
// require("./db/mongoose");

const PORT = process.env.PORT || 8000;

// const userRouter = require("./routers/user");
// const authRouter = require("./routers/auth");
// CORS middleware
// app.use(function (req, res, next) {
//   // Allow Origins
//   res.header("Access-Control-Allow-Origin", "*");
//   // Allow Methods
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   // Allow Headers
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, Accept, Content-Type, Authorization"
//   );
//   // Handle preflight, it must return 200
//   if (req.method === "OPTIONS") {
//     // Stop the middleware chain
//     return res.status(200).end();
//   }
//   // Next middleware
//   next();
// });

// Auth middleware
// app.use((req, res, next) => {
//   // login does not require jwt verification
//   if (req.path == '/api/login') {
//     // next middleware
//     return next()
//   }

//   // get token from request header Authorization
//   const token = req.headers.authorization

//   // Debug print
//   console.log("")
//   console.log(req.path)
//   console.log("authorization:", token)

//   // Token verification
//   try {
//     var decoded = jwt.verify(token, jwtSecret);
//     console.log("decoded", decoded)
//   } catch (err) {
//     // Catch the JWT Expired or Invalid errors
//     console.log(err)
//     return res.status(401).json({ "msg": err.message })
//   }

//   // next middleware
//   next()
// });

// app.use(userRouter);
// app.use(authRouter);
// Routes

// app.get("/api/token/ping", (req, res) => {
//   // Middleware will already catch if token is invalid
//   // so if he can get this far, that means token is valid
//   res.json({ msg: "all good mate" });
// });

// app.get("/api/ping", (req, res) => {
//   // random endpoint so that the client can call something
//   res.json({ msg: "pong" });
// });

import App from "./app";
import AuthController from "./auth/auth.controller";

const app = new App([new AuthController()], PORT);

app.listen();
