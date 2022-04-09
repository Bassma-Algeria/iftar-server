import { authService } from "../../../../../Ports/DriverPorts/AuthService";
import { ControllerFunction, STATUS_CODES } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const login: ControllerFunction = makeRestController(({ body }) => {
  const { email, password } = body;
  return authService.login({ email, password });
});

export { login };
