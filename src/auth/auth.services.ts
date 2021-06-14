import express from "express";
import jwt from "jsonwebtoken";
import {
  DataStoredInToken,
  //   DataStoredInRefreshToken,
} from "../interfaces/dataStoredInToken";
import Token from "../interfaces/token.interface";
import User from "../users/user.interface";
import userModel from "../users/user.model";

const SECRET = "dadasd asda sda sas dasd as";
// const SECRET2 = "newscretforrefreshtoken";
const TOKEN_EXPIRY = 24 * 60; //in min
// const REFRESH_TOKEN_EXPIRY=;
export const createToken = (user: User): Token => {
  const expiresIn = TOKEN_EXPIRY * 60; // a min
  const secret = SECRET;
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
};

// export const createRefreshToken = (user: User): Token => {
//   const expiresIn = 7 * 24 * 60 * 60; // 7 day
//   const secret = SECRET2;
//   const dataStoredInToken: DataStoredInRefreshToken = {
//     _id: user._id,
//   };
//   return {
//     expiresIn,
//     token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
//   };
// };

export const getUserIdFromToken = (token: string): string => {
  const verificationResponse = jwt.verify(token, SECRET) as DataStoredInToken;
  return verificationResponse._id;
};

// export const getUserIdFromRefreshToken = (token: string): string => {
//   const verificationResponse = jwt.verify(token, SECRET2) as DataStoredInToken;
//   return verificationResponse._id;
// };

export const createTokenCookie = (tokenName: string, tokenData: Token) => {
  return `${tokenName}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export const setTokenCookie = (tokenData: Token) => {
  return createTokenCookie("Token", tokenData);
};

// export const setRefreshTokenCookie = (tokenData: Token) => {
//   return createTokenCookie("RefreshToken", tokenData);
// };

// export const updateTokenFromRefreshToken = async (
//   refreshToken: Token,
//   response: express.Response
// ) => {
//   let userId = getUserIdFromRefreshToken(refreshToken.token);
//   const user = await userModel.findById(userId);
//   if (user) {
//     const tokenData = createToken(user);
//     response.setHeader("Set-Cookie", [setTokenCookie(tokenData)]);
//     return true;
//   }
//   return false;
// };
