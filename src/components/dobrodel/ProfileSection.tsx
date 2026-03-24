import { useState, useEffect, useCallback } from "react";
import { BookRequest, Item, Section } from "@/components/dobrodel/types";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/components/dobrodel/AuthContext";

const REQUESTS_URL = "https://functions.poehali.dev/cbb98ecc-463c-43c3-b6a9-e85a6decfc07";

type ProfileTab = "menu" | "mybooks" | "messages" | "favorites" | "settings";

interface ProfileSectionProps {
  setActiveSection: (section: Section) => void;
  initialTab?: ProfileTab;
}

export default function ProfileSection({ setActiveSection, initialTab = "menu" }: ProfileSectionProps) {
  const { user, openAuth, logout, myBooks, favorites } = useAuth();
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
                <ItemCard key={book.id} item={book} delay={i * 0.05} />
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
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setProfileTab("menu")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Настройки</h1>
              <p className="text-muted-foreground text-sm">Управление аккаунтом</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 mb-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                📚
              </div>
              <div>
                <p className="font-semibold text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-4">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Аккаунт</p>
            </div>
            <div className="px-5 py-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <Icon name="User" size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Имя</span>
              </div>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Email</span>
              </div>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Другое</p>
            </div>
            <button
              onClick={() => {
                logout();
                setActiveSection("home");
              }}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors text-left"
            >
              <Icon name="LogOut" size={18} className="text-red-500" />
              <span className="text-sm font-medium text-red-500">Выйти из аккаунта</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}