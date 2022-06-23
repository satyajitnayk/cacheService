import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils";
import { STATUS_CODES } from "../enums";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      walletAddress: string;
      endPoint: string;
    }
  }
}

export const authenticateAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { api_key, api_secrete } = req.headers;
  if (
    api_key == process.env.API_KEY &&
    api_secrete == process.env.API_SECRETE
  ) {
    // set userId,walletAddress,endPoint
    let data = req.params.key;
    if (!data) data = req.body.key;
    let keys = data?.split("-");
    req.userId = keys[0];
    req.walletAddress = keys[1];
    req.endPoint = keys[2];

    return next();
  } else {
    sendResponse(
      res,
      { msg: "access denied" },
      STATUS_CODES.UNAUTHORIZED,
      false
    );
  }
};
