import { TokenTypeEnum } from "../common/enums/security.enum.js";
import {
  BadRequestException,
  ForbiddenException,
} from "../common/utils/index.js";
import { decodeToken } from "../common/utils/security/token.security.js";

export const authentication = (tokenType = TokenTypeEnum.access) => {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      throw BadRequestException({ message: "Missing Authorization Key" });
    }

    const { authorization } = req.headers;

    const [flag, credential] = authorization.split(" ");

    if (!flag || !credential) {
      throw BadRequestException({ message: "Missing Authorization Parts" });
    }

    switch (flag) {
      case "Basic":
        const data = Buffer.from(credential, "base64").toString();
        console.log(data);

        const [username, password] = data.split(":");
        console.log({ username, password });
        break;

      case "Bearer":
        req.user = await decodeToken({
          token: credential,
          tokenType,
        });
        break;

      default:
        break;
    }

    next();
  };
};

export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException({ message: "Not Allowed Account" });
    }

    next();
  };
};
