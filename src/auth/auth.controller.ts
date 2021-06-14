import express from "express";
import bcrypt from "bcrypt";

import { Login } from "./auth.interface";
import User from "../users/user.interface";
import userModel from "../users/user.model";
import {
  // createRefreshToken,
  createToken,
  // setRefreshTokenCookie,
  setTokenCookie,
  // updateTokenFromRefreshToken,
} from "./auth.services";

class AuthController {
  public path = "";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/login`, this.loginUser);
    // this.router.post(`${this.path}/fetchNewToken`, this.fetchNewToken);
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
        const tokenData = createToken(user);
        // const refreshTokenData = createRefreshToken(user);
        response.setHeader("Set-Cookie", [
          setTokenCookie(tokenData),
          // setRefreshTokenCookie(refreshTokenData),
        ]);
        response.send(user);
      } else {
        response.status(400).send("invalid email address or password");
      }
    } else {
      response.status(400).send("invalid email address or password");
    }
  };

  // private fetchNewToken = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   const cookies = request.cookies;
  //   if (cookies && cookies.RefreshToken) {
  //     let successStatus = await updateTokenFromRefreshToken(
  //       cookies.RefreshToken,
  //       response
  //     );
  //     response.send({ isSuccess: successStatus });
  //   }
  //   response.send({ isSuccess: false });
  // };

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
        const tokenData = createToken(user);
        response.setHeader("Set-Cookie", [setTokenCookie(tokenData)]);
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
}

export default AuthController;
