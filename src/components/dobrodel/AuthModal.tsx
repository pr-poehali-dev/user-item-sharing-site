import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "./AuthContext";
import func2url from "@/../backend/func2url.json";

const AUTH_URL = (func2url as Record<string, string>)["auth"];

export default function AuthModal() {
  const { showAuthModal, closeAuth, login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) { setError("Заполните все обязательные поля"); return; }
    if (mode === "register" && !name) { setError("Введите ваше имя"); return; }
    if (password.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }
    if (mode === "register" && password !== confirmPassword) {
      setError("Пароли не совпадают"); return;
    }

    setLoading(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Что-то пошло не так");
        return;
      }
      login(data.name, data.email);
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={closeAuth}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-2xl">📚</span>
            <h2 className="font-display text-2xl font-bold text-foreground mt-1">
              {mode === "register" ? "Регистрация" : "Вход"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === "register"
                ? "Создайте аккаунт, чтобы отдавать и получать книги"
                : "Войдите в свой аккаунт"}
            </p>
          </div>
          <button onClick={closeAuth} className="text-muted-foreground hover:text-foreground p-1">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Ваше имя *</label>
              <input
                type="text"
                placeholder="Как вас зовут?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Пароль *</label>
            <input
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Повторите пароль *</label>
              <input
                type="password"
                placeholder="Введите пароль ещё раз"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-md mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? (mode === "register" ? "Регистрируюсь..." : "Вхожу...")
              : (mode === "register" ? "Зарегистрироваться" : "Войти")}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === "register" ? (
            <p className="text-xs text-muted-foreground">
              Уже есть аккаунт?{" "}
              <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">
                Войти
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Нет аккаунта?{" "}
              <button onClick={() => switchMode("register")} className="text-primary font-medium hover:underline">
                Зарегистрироваться
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
