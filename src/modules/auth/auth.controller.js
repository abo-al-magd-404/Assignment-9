import { Router } from "express";
import {
  login,
  loginWithGmail,
  signup,
  signupWithGmail,
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const account = await signup(req.body);
    return successResponse({ res, status: 201, data: { account } });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const fullHost = `${req.protocol}://${req.get("host")}`;
    const account = await login(req.body, fullHost);
    return successResponse({ res, status: 200, data: { account } });
  } catch (error) {
    next(error);
  }
});

router.post("/signup/gmail", async (req, res, next) => {
  try {
    const fullHost = `${req.protocol}://${req.get("host")}`;
    const account = await signupWithGmail(req.body, fullHost);
    return successResponse({ res, status: 201, data: { account } });
  } catch (error) {
    next(error);
  }
});

router.post("/login/gmail", async (req, res, next) => {
  try {
    const fullHost = `${req.protocol}://${req.get("host")}`;
    const account = await loginWithGmail(req.body, fullHost);
    return successResponse({ res, status: 200, data: { account } });
  } catch (error) {
    next(error);
  }
});

export default router;
