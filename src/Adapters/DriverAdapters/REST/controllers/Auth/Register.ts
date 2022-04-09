import { authService } from "../../../../../Ports/DriverPorts/AuthService";
import { ControllerFunction, STATUS_CODES } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const register: ControllerFunction = makeRestController(({ body }) => {
  const { email, password, confirmPassword, phoneNumber } = body;
  return authService.register({ email, password, confirmPassword, phoneNumber });
});

export { register };
