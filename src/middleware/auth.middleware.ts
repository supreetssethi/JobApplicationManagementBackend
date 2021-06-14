import { NextFunction, Response } from "express";
import { getUserIdFromToken } from "../auth/auth.services";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Token) {
    let token = cookies.Token;
    try {
      const id = getUserIdFromToken(token);
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        // code for refresh token should come here;
        if (cookies && cookies.RefreshToken) {
          // refresh token is available
        } else {
          next(new WrongAuthenticationTokenException());
        }
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
