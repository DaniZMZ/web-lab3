import { render, screen } from "@testing-library/react";
import QuoteForm from "./QuoteForm";
import { quoteSchema } from "@/lib/schemas";
import { vi } from "vitest";

vi.mock("@/app/actions/quotes", () => ({
  createQuote: vi.fn(),
  updateQuote: vi.fn(),
}));

vi.mock("@/store/useQuoteStore", () => ({
  useQuoteStore: vi.fn((selector) => selector({ addQuote: vi.fn(), updateQuote: vi.fn() })),
}));

describe("QuoteForm и Zod", () => {
  it("Zod возвращает ошибку при коротком тексте", () => {
    const invalidData = { quote: "Shrt", author: "Author" };
    const result = quoteSchema.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Цитата должна быть не менее 5 символов");
    }
  });

  it("рендерит форму с кнопкой добавления", () => {
    render(<QuoteForm />);
    expect(screen.getByText("Добавить")).toBeInTheDocument();
  });
});