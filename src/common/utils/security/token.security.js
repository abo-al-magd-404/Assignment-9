import jwt from "jsonwebtoken";
import {
  USER_REFRESH_TOKEN_SECRET_KEY,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  SYSTEM_TOKEN_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} from "../../../../config/config.service.js";
import { RoleEnum } from "../../enums/user.enum.js";
import { AudienceEnum, TokenTypeEnum } from "../../enums/security.enum.js";
import { userModel } from "../../../DB/models/user.model.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../response/error.response.js";
import { findOne } from "../../../DB/database.repository.js";

export const getTokenSignature = async (role) => {
  let access_signature = undefined;
  let refresh_signature = undefined;

  let audience = AudienceEnum.User;

  switch (role) {
    case RoleEnum.Admin:
      access_signature = SYSTEM_TOKEN_SECRET_KEY;
      refresh_signature = SYSTEM_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.System;
      break;

    default:
      access_signature = USER_TOKEN_SECRET_KEY;
      refresh_signature = USER_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.User;
      break;
  }

  return { access_signature, refresh_signature, audience };
};

export const getSignatureLevel = async (audienceType) => {
  let signatureLevel;

  switch (audienceType) {
    case AudienceEnum.System:
      signatureLevel = RoleEnum.Admin;
      break;

    default:
      signatureLevel = RoleEnum.User;
      break;
  }

  return signatureLevel;
};

export const generateToken = async ({
  Payload = {},
  SecretKey = USER_TOKEN_SECRET_KEY,
  options = {},
}) => {
  return jwt.sign(Payload, SecretKey, options);
};

export const verifyToken = async ({
  token,
  SecretKey = USER_TOKEN_SECRET_KEY,
}) => {
  return jwt.verify(token, SecretKey);
};

export const createLoginCredentials = async (user, issuer) => {
  const { access_signature, refresh_signature, audience } =
    await getTokenSignature(user.role);

  const access_token = await generateToken({
    Payload: { sub: user._id },
    SecretKey: access_signature,
    options: {
      issuer,
      audience: [TokenTypeEnum.access, audience],
      expiresIn: ACCESS_EXPIRES_IN,
    },
  });

  const refresh_token = await generateToken({
    Payload: { sub: user._id },
    SecretKey: refresh_signature,
    options: {
      issuer,
      audience: [TokenTypeEnum.refresh, audience],
      expiresIn: REFRESH_EXPIRES_IN,
    },
  });

  return { access_token, refresh_token };
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.access,
} = {}) => {
  const decode = jwt.decode(token);
  console.log({ decode });

  if (!decode?.aud?.length) {
    throw BadRequestException({
      message: "fail to decode this token, aud is required",
    });
  }

  const [decodedTokenType, audienceType] = decode.aud;

  if (decodedTokenType !== tokenType) {
    throw BadRequestException({
      message: `Invalid Token Type, token of type ${decodedTokenType} cannot access this api while we expected token of type ${tokenType}`,
    });
  }

  const signatureLevel = await getSignatureLevel(audienceType);
  console.log({ signatureLevel });

  const { access_signature, refresh_signature } =
    await getTokenSignature(signatureLevel);
  console.log({ access_signature, refresh_signature });

  const verifiedData = await verifyToken({
    token,
    SecretKey:
      tokenType == TokenTypeEnum.refresh ? refresh_signature : access_signature,
  });

  const user = await findOne({
    model: userModel,
    filter: {
      _id: verifiedData.sub,
    },
  });

  if (!user) {
    throw UnauthorizedException({ message: "Not Register Account" });
  }

  return user;
};
