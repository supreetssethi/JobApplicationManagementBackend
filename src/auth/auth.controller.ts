import * as express from "express";
import { Login } from "./auth.interface";
import User from "../user/user.interface";
import userModel from "../user/user.model";

class AuthController {
  public loginPath = "/login";
  public signupPath = "/signup";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.loginPath, this.loginUser);
    this.router.post(this.signupPath, this.onboardNewUser);
  }

  loginUser = (request: express.Request, response: express.Response) => {
    const credentials: Login = request.body;
    response.send(credentials);
  };

  onboardNewUser = (request: express.Request, response: express.Response) => {
    const userDetails: User = request.body;
    const newUser = new userModel(userDetails);
    newUser
      .save()
      .then((createdUser) => {
        response.status(201).send(createdUser);
      })
      .catch((err) => {
        response.status(400).send(err);
      });
  };
}

export default AuthController;
