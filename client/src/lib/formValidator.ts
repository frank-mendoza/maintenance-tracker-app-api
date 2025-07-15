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

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
export const userSetupschema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),

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

export const propertySchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description must be a string"),
  town: yup.string().required("Town is required"),
  province: yup.string().required("Province is required"),
  rent: yup.number().required("Rent is required").default(0),
});

export const tenantSchema = yup.object({
  role: yup.string().required("Role is required"),
  phone: yup.string().required("Phone is required"),
  name: yup.string().required("Name must be a string"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  lastName: yup.string().required("Last name is required"),
});
