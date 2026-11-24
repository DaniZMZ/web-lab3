"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Неверный логин или пароль");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Вход в систему</h2>
        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}
        <input name="username" placeholder="Логин (user или admin)" className="input input-bordered mb-3" required />
        <input name="password" type="password" placeholder="Пароль" className="input input-bordered mb-4" required />
        <button type="submit" className="btn btn-primary w-full">Войти</button>
        <p className="text-xs text-center mt-4 text-base-content/60">
          user / user <br/> admin / admin
        </p>
      </form>
    </div>
  );
}