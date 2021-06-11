import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
// import User from "./user.interface";
// import userModel from "./users/user.model";

class UserControler {
  public path = "";
  public router = express.Router();
  // private user = userModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.use(authMiddleware);
    this.router.get(`${this.path}/me`, this.myInformation);
  }

  private myInformation = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    response.status(200).send(request.user);
  };
}

export default UserControler;
