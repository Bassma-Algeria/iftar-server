import { Router } from "express";
import { makeExpressController } from "../ExpressControllerFactory";

import { login } from "../../controllers/Auth/Login";
import { register } from "../../controllers/Auth/Register";

const authRoutes: Router = Router();

authRoutes.post("/login", makeExpressController(login));
authRoutes.post("/register", makeExpressController(register));

export { authRoutes };
