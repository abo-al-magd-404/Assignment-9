import { compare, genSalt, hash } from "bcrypt";
import { SALT_ROUND } from "../../../../config/config.service.js";
import * as argon2 from "argon2";
import { hashApproachEnum } from "../../enums/security.enum.js";

export const generateHash = async ({
  plaintext,
  salt = SALT_ROUND,
  minor = "b",
  approach = hashApproachEnum.bcrypt,
}) => {
  let hashValue;

  switch (approach) {
    case hashApproachEnum.argon2:
      hashValue = await argon2.hash(plaintext);
      break;

    default:
      const generatedSalt = await genSalt(salt, minor);
      hashValue = await hash(plaintext, generatedSalt);
      break;
  }

  return hashValue;
};

export const compareHash = async ({
  plaintext,
  cipherText,
  approach = hashApproachEnum.bcrypt,
}) => {
  let match = false;

  switch (approach) {
    case hashApproachEnum.argon2:
      match = await argon2.verify(cipherText, plaintext);
      break;

    default:
      match = await compare(plaintext, cipherText);
      break;
  }

  return match;
};
