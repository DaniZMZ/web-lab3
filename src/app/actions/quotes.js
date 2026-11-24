"use server";

import { createQuoteOnServer, updateQuoteOnServer, deleteQuoteOnServer } from "@/lib/quotes";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { quoteSchema } from "@/lib/schemas";

export async function createQuote(prevState, formData) {
  const session = await auth();
  if (!session) return { error: "Необходима авторизация" };

  const rawData = { quote: formData.get("quote"), author: formData.get("author") };
  
  const parsed = quoteSchema.safeParse(rawData);
  if (!parsed.success) {
    return { 
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Проверьте правильность заполнения полей" 
    };
  }

  try {
    const data = await createQuoteOnServer(parsed.data);
    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    return { error: "Ошибка сервера" };
  }
}

export async function updateQuote(prevState, formData) {
  const session = await auth();
  if (!session) return { error: "Необходима авторизация" };

  const id = formData.get("id");
  const rawData = { quote: formData.get("quote"), author: formData.get("author") };

  const parsed = quoteSchema.safeParse(rawData);
  if (!parsed.success) {
    return { 
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Проверьте правильность заполнения полей" 
    };
  }

  try {
    const data = await updateQuoteOnServer(id, parsed.data);
    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    return { error: "Ошибка сервера" };
  }
}

export async function deleteQuote(id) {
  const session = await auth();
  if (!session) return { error: "Необходима авторизация" };
  
  // Защита на сервере: только админ может удалять
  if (session.user.role !== "admin") {
    return { error: "Доступ запрещен. Только администратор может удалять." };
  }

  try {
    await deleteQuoteOnServer(id);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Ошибка сервера" };
  }
}