// src/features/profile/schemas.ts
import * as z from "zod";

const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required.").max(50).optional(),
    phone: z.string().min(10, "Please enter a valid phone number.").optional(),
});

export default ProfileSchema;