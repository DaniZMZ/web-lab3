import { fetchQuotes } from "@/lib/quotes";
import QuoteList from "@/components/QuoteList";
import { auth, signOut } from "@/auth";

export const instant = false; 

export default async function HomePage() {
  const initialData = await fetchQuotes({ limit: 10, skip: 0 });
  const session = await auth();

  return (
    <main className="container mx-auto p-4 max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Цитаты</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm">Вы: <b>{session.user.name}</b> ({session.user.role})</span>
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="btn btn-sm btn-outline">Выйти</button>
          </form>
        </div>
      </div>
      <QuoteList initialData={initialData} userRole={session.user.role} />
    </main>
  );
}