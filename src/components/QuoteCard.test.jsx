import { render, screen, fireEvent } from "@testing-library/react";
import QuoteCard from "./QuoteCard";
import { vi } from "vitest";

vi.mock("@/app/actions/quotes", () => ({
  deleteQuote: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock("@/store/useQuoteStore", () => ({
  useQuoteStore: vi.fn(() => vi.fn()),
}));

describe("QuoteCard", () => {
  const mockQuote = { id: 1, quote: "Test Quote Text", author: "Test Author" };

  it("отображает текст цитаты и автора", () => {
    render(<QuoteCard quote={mockQuote} userRole="user" />);
    expect(screen.getByText(/Test Quote Text/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
  });

  it("не показывает кнопку удаления для роли user", () => {
    render(<QuoteCard quote={mockQuote} userRole="user" />);
    expect(screen.queryByText("Удалить")).not.toBeInTheDocument();
  });

  it("показывает кнопку удаления для роли admin", () => {
    window.confirm = vi.fn(() => true);
    render(<QuoteCard quote={mockQuote} userRole="admin" />);
    expect(screen.getByText("Удалить")).toBeInTheDocument();
  });
});