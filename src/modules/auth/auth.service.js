import { ProviderEnum } from "../../common/enums/user.enum.js";
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "../../common/utils/response/index.js";

import {
  encrypt,
  compareHash,
  generateHash,
} from "../../common/utils/security/index.js";
import { createLoginCredentials } from "../../common/utils/security/token.security.js";

import { userModel, findOne, createOne, create } from "../../DB/index.js";

import { OAuth2Client } from "google-auth-library";

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: "WEB_CLIENT_ID",
  });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) {
    throw new BadRequestException({
      message: "Fail to verify this account with google",
    });
  }
  return payload;
};

export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;

  const checkUserExist = await findOne({
    model: userModel,
    filter: { email },
  });

  if (checkUserExist) {
    throw new ConflictException({ message: "Email already exist" });
  }

  const user = await createOne({
    model: userModel,
    data: {
      username,
      email,
      password: await generateHash({
        plaintext: password,
      }),
      phone: await encrypt(phone),
    },
  });

  return user;
};

export const login = async (inputs, issuer) => {
  const { email, password } = inputs;

  const user = await findOne({
    model: userModel,
    filter: { email },
    options: {
      lean: true,
    },
  });

  if (!user) {
    throw new NotFoundException({ message: "Invalid Login Credentials" });
  }

  if (
    !(await compareHash({ plaintext: password, cipherText: user.password }))
  ) {
    throw new NotFoundException({ message: "Invalid Login Credentials" });
  }

  return createLoginCredentials(user, issuer);
};

export const signupWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleToken(idToken);

  const checkUserExist = await findOne({
    model: userModel,
    filter: { email: payload.email },
  });

  if (checkUserExist) {
    if (checkUserExist.provider === ProviderEnum.System) {
      throw new ConflictException({
        message: "Account Already Exist With Different Provider",
      });
    }
    return loginWithGmail({ idToken }, issuer);
  }

  const users = await create({
    model: userModel,
    data: [
      {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        provider: ProviderEnum.Google,
        profilePicture: payload.picture,
        confirmEmail: new Date(),
      },
    ],
  });

  return createLoginCredentials(users[0], issuer);
};

export const loginWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleToken(idToken);

  const user = await findOne({
    model: userModel,
    filter: { email: payload.email },
  });

  if (!user) {
    throw new NotFoundException({
      message: "User not found, please signup first",
    });
  }

  if (user.provider !== ProviderEnum.Google) {
    throw new BadRequestException({
      message: "Invalid login credentials or invalid approach",
    });
  }

  return createLoginCredentials(user, issuer);
};
