import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import User from "../models/User";
import { APRTMENT_TYPE } from "../utils/constants";
import Property from "../models/Property";
import mongoose from "mongoose";

interface WithValidationErrors {
  (validatedValues: any[]): [ValidationChain[], RequestHandler];
}

type FieldOptions = {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  lastName?: boolean;
  location?: boolean;
  isLogin?: boolean;
  // add new fields as needed
};

const withValidationErrors: WithValidationErrors = (validatedValues) => {
  return [
    validatedValues,
    (req: Request, res: Response, next: NextFunction): void => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg as string);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages[0]);
        }

        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        console.error("Validation errors:", errorMessages);
        throw new BadRequestError(errorMessages[0]);
      }
      next();
    },
  ];
};

export const validateInputFields = (fields: FieldOptions) =>
  withValidationErrors(
    [
      fields.name && body("name").notEmpty().withMessage("Name is required"),

      fields.email &&
        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Invalid email format")
          .custom(async (email) => {
            if (fields.isLogin) return; // Skip email check for login
            const user = await User.findOne({ email });
            if (user) {
              throw new BadRequestError("Email already exists");
            }
          }),

      fields.password &&
        body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long"),

      fields.lastName &&
        body("lastName").notEmpty().withMessage("Last name is required"),

      fields.location &&
        body("location").notEmpty().withMessage("Location is required"),
    ].filter(Boolean)
  ); // remove falsy entries

export const validateInputProperty = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),

  body("location.town").notEmpty().withMessage("Town is required"),

  body("location.province").notEmpty().withMessage("Province is required"),

  body("description").isString().withMessage("Description must be a string"),

  body("type")
    .isIn(Object.values(APRTMENT_TYPE))
    .withMessage("invalid apartment type"),
  body("rent")
    .isNumeric()
    .withMessage("Rent must be a number")
    .custom((val) => val >= 0)
    .withMessage("Rent must be 0 or greater"),
  body("units")
    .isNumeric()
    .withMessage("Unit must be a number")
    .custom((val) => val >= 0)
    .withMessage("Unit must be 0 or greater"),
]); // remove falsy entries

export const validateProperty = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);

    if (!isValidId) throw new BadRequestError("Invalid MongoDB id");

    const property = await Property.findById(value);
    if (!property) throw new NotFoundError(`no property with id : ${value}`);
  }),
]);
