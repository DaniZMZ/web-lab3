import { z } from "zod";

export const quoteSchema = z.object({
  quote: z.string().min(5, "Цитата должна быть не менее 5 символов"),
  author: z.string().min(2, "Имя автора слишком короткое"),
}).refine((data) => data.quote.toLowerCase() !== data.author.toLowerCase(), {
  message: "Цитата не может быть просто именем автора",
  path: ["quote"],
});