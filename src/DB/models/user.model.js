import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enums/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First Name can't be less tha 2 chars"],
      maxLength: [20, "First Name can't be more tha 20 chars"],
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      minLength: [2, "First Name can't be less tha 2 chars"],
      maxLength: [20, "First Name can't be more tha 20 chars"],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.System;
      },
    },

    phone: {
      type: String,
    },

    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },

    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },

    profilePicture: {
      type: String,
    },

    coverPicture: {
      type: [String],
    },

    confirmEmail: {
      type: Date,
    },

    changeCredentialsTime: {
      type: Date,
    },

    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    
  },
  {
    collection: "Route_Users",
    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];

    this.set({ firstName, lastName });
  })
  .get(function () {
    return { firstName: this.firstName } + " " + { lastName: this.lastName };
    // return this.firstName + " " + this.lastName;
  });

export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
