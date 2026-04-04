import { useState, useEffect, useCallback } from "react";
import { BookRequest, Item, Section } from "@/components/dobrodel/types";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/components/dobrodel/AuthContext";
import func2url from "@/../backend/func2url.json";

const REQUESTS_URL = "https://functions.poehali.dev/cbb98ecc-463c-43c3-b6a9-e85a6decfc07";
const BOOKS_URL = (func2url as Record<string, string>)["books"];
const AUTH_URL = (func2url as Record<string, string>)["auth"];

type ProfileTab = "menu" | "mybooks" | "messages" | "favorites" | "settings";

interface ProfileSectionProps {
  setActiveSection: (section: Section) => void;
  initialTab?: ProfileTab;
}

export default function ProfileSection({ setActiveSection, initialTab = "menu" }: ProfileSectionProps) {
  const { user, openAuth, logout, updateProfile, myBooks, favorites, removeMyBook } = useAuth();
  const [profileTab, setProfileTab] = useState<ProfileTab>(initialTab);
  const [notifications, setNotifications] = useState<BookRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = useCallback(() => {
    if (!user) return;
    setLoadingNotifications(true);
    fetch(`${REQUESTS_URL}?owner_email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data: BookRequest[]) => {
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifications(false));
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`${REQUESTS_URL}?owner_email=${encodeURIComponent(user.email)}&count_only=1`)
        .then((r) => r.json())
        .then((data: BookRequest[]) => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((n) => !n.is_read).length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {profileTab === "menu" && (
        <>
          <div className="mb-6">
            <h1 className="font-display text-4xl font-bold text-foreground mb-1">Профиль</h1>
            <p className="text-muted-foreground text-sm">Ваши книги и история обменов</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6 mb-4 text-center shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
              📚
            </div>
            <h2 className="font-semibold text-lg">{user ? user.name : "Гость"}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {user ? user.email : "Войдите, чтобы управлять объявлениями"}
            </p>
            {!user && (
              <button
                onClick={openAuth}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all"
              >
                Войти или зарегистрироваться
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { val: String(myBooks.length), label: "активных", icon: "Package" },
              { val: "0", label: "отдано", icon: "BookOpen" },
              { val: "0", label: "получено", icon: "Heart" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
                <Icon name={s.icon} size={20} className="mx-auto text-primary mb-1" />
                <div className="font-display text-2xl font-bold text-foreground">{s.val}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <button
              onClick={() => setProfileTab("mybooks")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name="BookOpen" size={18} className="text-primary" />
                <span className="text-sm font-medium">Мои книги</span>
                {myBooks.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                    {myBooks.length}
                  </span>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => { setProfileTab("messages"); fetchNotifications(); setUnreadCount(0); }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name="MessageCircle" size={18} className="text-primary" />
                <span className="text-sm font-medium">Сообщения</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => setProfileTab("favorites")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name="Heart" size={18} className="text-primary" />
                <span className="text-sm font-medium">Избранное</span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => setProfileTab("settings")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name="Settings" size={18} className="text-primary" />
                <span className="text-sm font-medium">Настройки</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </>
      )}

      {profileTab === "mybooks" && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setProfileTab("menu")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Мои книги</h1>
              <p className="text-muted-foreground text-sm">Ваши активные объявления</p>
            </div>
          </div>
          {myBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📚</div>
              <p className="font-medium text-foreground mb-1">Пока нет объявлений</p>
              <p className="text-sm text-muted-foreground mb-6">Отдайте книгу — она найдёт нового читателя</p>
              <button
                onClick={() => { setProfileTab("menu"); setActiveSection("add"); }}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all"
              >
                Добавить книгу
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {myBooks.map((book: Item, i: number) => (
                <div key={book.id} className="relative group">
                  <ItemCard item={book} delay={i * 0.05} />
                  <button
                    onClick={() => {
                      if (!user) return;
                      fetch(`${BOOKS_URL}?id=${book.id}&owner_email=${encodeURIComponent(user.email)}`, { method: "DELETE" })
                        .then(() => removeMyBook(book.id))
                        .catch(() => {});
                    }}
                    className="absolute top-3 right-3 z-10 bg-white border border-red-200 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                    title="Удалить объявление"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {profileTab === "messages" && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setProfileTab("menu")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Сообщения</h1>
              <p className="text-muted-foreground text-sm">Кто хочет забрать ваши книги</p>
            </div>
          </div>
          {loadingNotifications ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3 animate-pulse">💬</div>
              <p>Загружаю...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">💬</div>
              <p className="font-medium text-foreground mb-1">Пока нет запросов</p>
              <p className="text-sm text-muted-foreground">Когда кто-то захочет забрать вашу книгу — вы увидите это здесь</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{n.requester_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Хочет забрать: <span className="text-foreground font-medium">{n.book_title}</span>
                      </p>
                      <p className="text-xs text-primary mt-1">{n.requester_email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(n.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {profileTab === "favorites" && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setProfileTab("menu")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Избранное</h1>
              <p className="text-muted-foreground text-sm">Книги, которые вас заинтересовали</p>
            </div>
          </div>
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🤍</div>
              <p className="font-medium text-foreground mb-1">Пока ничего нет</p>
              <p className="text-sm text-muted-foreground mb-6">Нажмите ❤️ на карточке книги, чтобы сохранить её сюда</p>
              <button
                onClick={() => { setProfileTab("menu"); setActiveSection("catalog"); }}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {favorites.map((book: Item, i: number) => (
                <ItemCard key={book.id} item={book} delay={i * 0.05} />
              ))}
            </div>
          )}
        </>
      )}

      {profileTab === "settings" && (
        <SettingsTab
          user={user}
          onBack={() => setProfileTab("menu")}
          onLogout={() => { logout(); setActiveSection("home"); }}
          updateProfile={updateProfile}
        />
      )}
    </div>
  );
}

interface SettingsTabProps {
  user: { name: string; email: string } | null;
  onBack: () => void;
  onLogout: () => void;
  updateProfile: (name: string) => void;
}

function SettingsTab({ user, onBack, onLogout, updateProfile }: SettingsTabProps) {
  const [newName, setNewName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!currentPassword) { setError("Введите текущий пароль для подтверждения"); return; }
    if (newPassword && newPassword.length < 6) { setError("Новый пароль должен быть не менее 6 символов"); return; }
    if (newPassword && newPassword !== confirmNewPassword) { setError("Новые пароли не совпадают"); return; }
    if (!newName.trim() && !newPassword) { setError("Измените имя или введите новый пароль"); return; }

    setSaving(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          email: user?.email,
          current_password: currentPassword,
          new_name: newName.trim() !== user?.name ? newName.trim() : "",
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Что-то пошло не так"); return; }
      updateProfile(data.name);
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
      setSuccess("Изменения сохранены!");
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-muted transition-colors">
          <Icon name="ArrowLeft" size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Настройки</h1>
          <p className="text-muted-foreground text-sm">Редактирование профиля</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
            📚
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Имя</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Смена пароля</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Новый пароль</label>
                <input
                  type="password"
                  placeholder="Оставьте пустым, чтобы не менять"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {newPassword && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Повторите новый пароль</label>
                  <input
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <label className="block text-sm font-medium mb-1.5">Текущий пароль *</label>
            <input
              type="password"
              placeholder="Для подтверждения изменений"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Сохраняю..." : "Сохранить изменения"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors text-left"
        >
          <Icon name="LogOut" size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-500">Выйти из аккаунта</span>
        </button>
      </div>
    </>
  );
}