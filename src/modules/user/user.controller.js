import { Router } from "express";
import { profile, RotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { verifyToken } from "../../common/utils/security/token.security.js";
import { USER_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
const router = Router();

router.get(
  "/",
  authentication()
,  // authorization(endpoint.profile),
  async (req, res, next) => {
    console.log(req.headers);

    const account = await profile(req.user);
    return successResponse({ res, data: { account } });
  },
);

router.get(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const account = await RotateToken(
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({ res, data: { account } });
  },
);

export default router;
