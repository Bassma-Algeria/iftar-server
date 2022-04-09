import { Request, Response } from "express";
import { ControllerFunction } from "../@types/RequestResponse.interfaces";

const makeExpressController = (controller: ControllerFunction) => {
  return async (req: Request, res: Response) => {
    const result = await controller({
      body: req.body,
      headers: req.headers,
      query: req.query,
      params: req.params,
    });

    const { status, ...rest } = result;
    res.status(status as number).json(rest);
  };
};

export { makeExpressController };
