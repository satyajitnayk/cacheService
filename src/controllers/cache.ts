import { Request, Response, NextFunction } from "express";
import { sendResponse, redis } from "../utils";
import { UserResponse } from "../models";
import { STATUS_CODES, EXPIRY } from "../enums";

export const getFromCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get key from req.params
    const { key } = req.params;
    // find in cache
    let userResponse = await redis.get(key);
    if (!!userResponse) {
      sendResponse(res, userResponse);
    } else {
      // get it from DB
      let userResponseFromDB = await UserResponse.findOne({
        userId: req.userId,
        walletAddress: req.walletAddress,
        endPoint: req.endPoint,
      }).select("value -_id");
      if (!!userResponseFromDB) {
        const value = userResponseFromDB.value;
        // store in redis
        await redis.setex(key, EXPIRY.ONE_HOUR, value);
        sendResponse(res, value);
      } else {
        sendResponse(
          res,
          { msg: "data not found" },
          STATUS_CODES.NOT_FOUND,
          false
        );
      }
    }
  } catch (error) {
    sendResponse(res, { msg: error }, STATUS_CODES.SERVER_ERROR, false);
  }
};

export const setInCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get required data from request body
    let { cacheConfig, key, value } = req.body;
    let { isDB = false, expireIn = "3600" } = cacheConfig;
    if (isDB) {
      // check if key already exists in DB
      let userResponse = await UserResponse.findOne({
        userId: req.userId,
        walletAddress: req.walletAddress,
        endPoint: req.endPoint,
      });
      if (!!userResponse) {
        // update existing value for the key
        userResponse.value = value;
        await userResponse.save();
      } else {
        // create new record
        await UserResponse.create({
          userId: req.userId,
          walletAddress: req.walletAddress,
          endPoint: req.endPoint,
          value: value,
        });
      }
    }

    // set value in cache against key
    if (expireIn == EXPIRY.NEVER) {
      await redis.set(key, value);
    } else {
      await redis.setex(key, expireIn, value);
    }
    sendResponse(res);
  } catch (error) {
    sendResponse(res, { msg: error }, STATUS_CODES.SERVER_ERROR, false);
  }
};

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = {
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    };
    sendResponse(res, data);
  } catch (error) {
    sendResponse(res, { msg: error }, STATUS_CODES.SERVER_ERROR, false);
  }
};
