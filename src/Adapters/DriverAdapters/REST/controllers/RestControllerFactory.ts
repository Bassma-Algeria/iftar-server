import {
  ControllerFunction,
  HttpRequest,
  STATUS_CODES,
} from "../@types/RequestResponse.interfaces";

const makeRestController = (controller: (req: HttpRequest) => Promise<any>): ControllerFunction => {
  return async (req) => {
    try {
      const data = await controller(req);

      return { success: true, data, status: STATUS_CODES.SUCCESS };
    } catch (error: any) {
      if (error instanceof Error) {
        return { success: false, status: STATUS_CODES.SERVER_ERROR, error: error.message };
      }

      if (error.authorization) {
        return { success: false, status: STATUS_CODES.NOT_AUTHORIZED, error: error.authorization };
      }

      return { success: false, status: STATUS_CODES.BAD_REQUEST, error };
    }
  };
};
export { makeRestController };
