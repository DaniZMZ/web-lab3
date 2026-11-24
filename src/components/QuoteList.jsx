"use client";

import { useEffect, useState, useRef } from "react";
import { useQuoteStore } from "@/store/useQuoteStore";
import QuoteCard from "./QuoteCard";
import QuoteSearch from "./QuoteSearch";
import QuoteForm from "./QuoteForm";

// Добавлен userRole в пропсы
export default function QuoteList({ initialData, userRole }) {
  const [skip, setSkip] = useState(initialData.quotes.length);
  const [total, setTotal] = useState(initialData.total);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const quotes = useQuoteStore((s) => s.quotes);
  const setQuotes = useQuoteStore((s) => s.setQuotes);
  const search = useQuoteStore((s) => s.search);

  // Инициализируем Store ТОЛЬКО ОДИН РАЗ при монтировании
  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current) {
      setQuotes(initialData.quotes);
      isInitialized.current = true;
    }
  }, [initialData.quotes, setQuotes]);

  const hasMore = skip < total;

  async function loadMore() {
    setLoadingMore(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes?limit=10&skip=${skip}`);
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      
      useQuoteStore.setState((state) => ({
        quotes: [...state.quotes, ...data.quotes],
      }));
      setSkip((prev) => prev + data.quotes.length);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const filtered = search
    ? quotes.filter(
        (q) =>
          q.quote.toLowerCase().includes(search.toLowerCase()) ||
          q.author.toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  return (
    <div>
      {/* Панель управления: поиск и кнопка добавления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:max-w-md">
          <QuoteSearch />
        </div>
        <button 
          className="btn btn-primary whitespace-nowrap" 
          onClick={() => setIsAdding(true)}
        >
          + Добавить цитату
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Список цитат */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-base-content/70">
          {search ? "По запросу ничего не найдено." : "Цитат пока нет."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quote) => (
            // Передаем userRole в каждую карточку
            <QuoteCard key={quote.id} quote={quote} userRole={userRole} />
          ))}
        </div>
      )}

      {/* Пагинация */}
      {hasMore && !search && (
        <div className="text-center mt-6">
          <button 
            className="btn btn-primary" 
            onClick={loadMore} 
            disabled={loadingMore}
          >
            {loadingMore ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Загрузить ещё"
            )}
          </button>
        </div>
      )}

      {/* Модальное окно добавления */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Новая цитата</h2>
            <QuoteForm onClose={() => setIsAdding(false)} />
            <button 
              className="btn btn-ghost mt-2 w-full" 
              onClick={() => setIsAdding(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}