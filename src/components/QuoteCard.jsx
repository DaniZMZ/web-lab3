"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteQuote } from "@/app/actions/quotes";
import QuoteForm from "./QuoteForm";
import { useQuoteStore } from "@/store/useQuoteStore";

export default function QuoteCard({ quote, userRole }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const removeQuote = useQuoteStore((s) => s.removeQuote);

  async function handleDelete() {
    if (!confirm("Удалить эту цитату?")) return;
    setDeleting(true);
    try {
      const res = await deleteQuote(quote.id);
      if (res?.error) {
        alert(res.error);
      } else {
        removeQuote(quote.id);
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <blockquote className="text-lg italic text-base-content">“{quote.quote}”</blockquote>
          <p className="text-right font-semibold text-base-content/80">— {quote.author}</p>
          <div className="card-actions justify-end mt-2">
            <Link href={`/quotes/${quote.id}`} className="btn btn-sm btn-ghost">Подробнее</Link>
            <button className="btn btn-sm btn-outline btn-info" onClick={() => setEditing(true)}>Редактировать</button>
            
            {userRole === "admin" && (
              <button className="btn btn-sm btn-outline btn-error" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-xs"></span> : "Удалить"}
              </button>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Редактировать цитату</h2>
            <QuoteForm initialData={quote} onClose={() => setEditing(false)} />
            <button className="btn btn-ghost mt-2 w-full" onClick={() => setEditing(false)}>Отмена</button>
          </div>
        </div>
      )}
    </>
  );
}