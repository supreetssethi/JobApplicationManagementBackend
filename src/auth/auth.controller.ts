import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Login } from "./auth.interface";
import User from "../users/user.interface";
import userModel from "../users/user.model";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import Token from "../interfaces/token.interface";

class AuthController {
  public path = "";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/signup`, this.onboardNewUser);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private loginUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    const credentials: Login = request.body;
    const user = await this.user.findOne({ email: credentials.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        credentials.password,
        user.get("password", null, { getters: false })
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        response.status(400).send("invalid email address or password");
      }
    } else {
      response.status(400).send("invalid email address or password");
    }
  };

  private onboardNewUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: User = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      response.status(400).send("Email alredy exists");
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      try {
        const user = await this.user.create({
          ...userData,
          password: hashedPassword,
        });
        const tokenData = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        response.send(user);
      } catch (ex) {
        response.status(400).send(ex.message);
      }
    }
  };
  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
  private createToken(user: User): Token {
    const expiresIn = 60 * 60; // an hour
    const secret = "dadasd asda sda sas dasd as";
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
  private createCookie(tokenData: Token) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthController;
