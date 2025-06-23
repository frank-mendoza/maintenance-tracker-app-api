import * as yup from "yup";

export const userRegisterSchema = yup.object({
  name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastname: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  // .matches(/[A-Z]/, "Must contain an uppercase letter")
  // .matches(/[a-z]/, "Must contain a lowercase letter")
  // .matches(/[0-9]/, "Must contain a number")
  // .matches(/[@$!%*?&#]/, "Must contain a special character"),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const userLoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),

  password: yup.string().required("Password is required"),
});
