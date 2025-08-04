// src/features/orders/schemas.ts
import * as z from "zod";

export const AddAddressSchema = z.object({
    street: z.string().min(1, { message: "Street address must not be empty." }),
    city: z.string().min(1, { message: "City must not be empty." }),
});