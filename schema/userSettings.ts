import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom(
    (value) => {
      const found = Currencies.some((c) => c.value === value);
      return found; // Return true if valid, false if invalid
    },
    { message: "Invalid currency" }
  ), // Optional: Custom error message
});
