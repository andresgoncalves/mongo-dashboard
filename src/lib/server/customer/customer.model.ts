import { z } from "zod";
import { db } from "../db";

export interface ICustomer {
  dni: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "M" | "F" | "Other";
}

export const customerSchema = z.object({
  dni: z.number().int("Cédula de identidad inválida"),
  firstName: z.string().min(1, "Nombre inválido"),
  lastName: z.string().min(1, "Apellido inválido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z
    .string()
    .regex(
      /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/,
      "Número de teléfono inválido",
    ),
  gender: z.enum(["M", "F", "Other"], {
    invalid_type_error: "Género inválido",
  }),
});

export const Customers = db.collection<ICustomer>("customers");
