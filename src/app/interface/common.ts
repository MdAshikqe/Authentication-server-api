import { UserRole } from "../../../generated/prisma/enums";

export type IAuthUser = {
  email: string;
  role: UserRole;
} | null;

export type IFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};
