import z from "zod";

const createClinetValidationSchema = z.object({
  password: z.string(),
  client: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "email is required",
    }),
    contactNumber: z.string({
      error: "contact number is required",
    }),
  }),
});
const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "email is required====",
    }),
    contactNumber: z.string({
      error: "contact number is required",
    }),
  }),
});

export const userValidation = {
  createClinetValidationSchema,
  createAdminValidationSchema,
};
