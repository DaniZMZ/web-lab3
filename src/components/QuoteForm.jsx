"use client";

import { useActionState, useEffect } from "react";
import { createQuote, updateQuote as updateQuoteAction } from "@/app/actions/quotes";
import { useQuoteStore } from "@/store/useQuoteStore";

export default function QuoteForm({ initialData, onClose }) {
  const action = initialData ? updateQuoteAction : createQuote;
  const [state, formAction, pending] = useActionState(action, null);

  const addQuote = useQuoteStore((s) => s.addQuote);
  const updateQuote = useQuoteStore((s) => s.updateQuote);

  useEffect(() => {
    if (!state?.success) return;
    if (initialData) {
      updateQuote(initialData.id, state.data);
    } else {
      addQuote(state.data);
    }
    if (onClose) onClose();
  }, [state, initialData, addQuote, updateQuote, onClose]);

  return (
    <form action={formAction} className="space-y-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Текст цитаты</span>
        </label>
        <textarea
          name="quote"
          className={`textarea textarea-bordered w-full ${state?.fieldErrors?.quote ? "textarea-error" : ""}`}
          defaultValue={initialData?.quote ?? ""}
          rows={3}
        />
        {state?.fieldErrors?.quote && (
          <span className="text-error text-sm mt-1">{state.fieldErrors.quote[0]}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Автор</span>
        </label>
        <input
          name="author"
          type="text"
          className={`input input-bordered w-full ${state?.fieldErrors?.author ? "input-error" : ""}`}
          defaultValue={initialData?.author ?? ""}
        />
        {state?.fieldErrors?.author && (
          <span className="text-error text-sm mt-1">{state.fieldErrors.author[0]}</span>
        )}
      </div>

      {state?.error && !state?.fieldErrors && (
        <div className="alert alert-error text-sm">{state.error}</div>
      )}

      <div className="pt-2">
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? <span className="loading loading-spinner loading-sm"></span> : initialData ? "Сохранить изменения" : "Добавить"}
        </button>
      </div>
    </form>
  );
}