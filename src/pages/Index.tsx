import { useState, useEffect, useCallback } from "react";
import { Section, CATEGORIES, NAV_ITEMS, FormData, Item, BookRequest } from "@/components/dobrodel/types";
import Header from "@/components/dobrodel/Header";
import HomePage from "@/components/dobrodel/HomePage";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";
import { AuthProvider, useAuth } from "@/components/dobrodel/AuthContext";
import AuthModal from "@/components/dobrodel/AuthModal";

const BOOKS_URL = "https://functions.poehali.dev/b3760fda-9d1b-466c-be33-dae1c5039801";
const REQUESTS_URL = "https://functions.poehali.dev/cbb98ecc-463c-43c3-b6a9-e85a6decfc07";

function dbBookToItem(b: Record<string, string | number>): Item {
  return {
    id: Number(b.id),
    title: String(b.title),
    category: String(b.category),
    size: String(b.author_name || ""),
    condition: String(b.condition),
    description: String(b.description || ""),
    author: String(b.author_name || ""),
    city: String(b.city || ""),
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    emoji: String(b.emoji || "📚"),
    contact: String(b.contact || ""),
    pickup: String(b.pickup || ""),
    ownerEmail: String(b.owner_email || ""),
  };
}

function AppContent() {
  const { user, openAuth, myBooks, addMyBook } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [profileTab, setProfileTab] = useState<"menu" | "mybooks" | "messages">("menu");
  const [notifications, setNotifications] = useState<BookRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [books, setBooks] = useState<Item[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "Художественная",
    size: "",
    condition: "Хорошее",
    description: "",
    city: "",
    name: "",
    phone: "",
  });

  const fetchBooks = useCallback(() => {
    setLoadingBooks(true);
    const url = activeCategory !== "Все"
      ? `${BOOKS_URL}?category=${encodeURIComponent(activeCategory)}`
      : BOOKS_URL;
    fetch(url)
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data.map(dbBookToItem) : []))
      .catch(() => setBooks([]))
      .finally(() => setLoadingBooks(false));
  }, [activeCategory]);

  useEffect(() => {
    if (activeSection === "catalog") fetchBooks();
  }, [activeSection, fetchBooks]);

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

  // Проверяем непрочитанные уведомления при открытии профиля
  useEffect(() => {
    if (activeSection === "profile" && user) {
      fetch(`${REQUESTS_URL}?owner_email=${encodeURIComponent(user.email)}&count_only=1`)
        .then((r) => r.json())
        .then((data: BookRequest[]) => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((n) => !n.is_read).length);
          }
        })
        .catch(() => {});
    }
  }, [activeSection, user]);

  const handlePublish = async () => {
    if (!user) { openAuth(); return; }
    if (!formData.title) return;
    setPublishing(true);
    try {
      const res = await fetch(BOOKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          condition: formData.condition,
          description: formData.description,
          author_name: formData.name || user.name,
          city: formData.city,
          contact: formData.phone || user.email,
          pickup: formData.city || "Уточните при контакте",
          emoji: "📚",
          owner_email: user.email,
        }),
      });
      const data = await res.json();
      const newBook: Item = {
        id: data.id || Date.now(),
        title: formData.title,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        description: formData.description || "Без описания",
        author: formData.name || user.name,
        city: formData.city || "Не указан",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        emoji: "📚",
        contact: formData.phone || user.email,
        pickup: formData.city || "Уточните при контакте",
      };
      addMyBook(newBook);
      setFormData({ title: "", category: "Художественная", size: "", condition: "Хорошее", description: "", city: "", name: "", phone: "" });
      setActiveSection("profile");
      setProfileTab("mybooks");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1">
        {activeSection === "home" && (
          <HomePage onNavigate={setActiveSection} />
        )}

        {/* CATALOG */}
        {activeSection === "catalog" && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Каталог книг</h1>
              <p className="text-muted-foreground text-sm">Всё бесплатно. Просто напишите владельцу</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по книгам..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white border border-border text-foreground/70 hover:border-primary/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {loadingBooks ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-4xl mb-3 animate-pulse">📚</div>
                <p>Загружаю книги...</p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {books.map((item, i) => (
                  <ItemCard key={item.id} item={item} delay={i * 0.05} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-5xl mb-3">🔍</div>
                <p>В этой категории пока нет книг</p>
              </div>
            )}
          </div>
        )}

        {/* ADD */}
        {activeSection === "add" && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Отдать книгу</h1>
              <p className="text-muted-foreground text-sm">Заполни форму — и объявление сразу увидят читатели</p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <div>
                <label className="block text-sm font-medium mb-1.5">Название книги *</label>
                <input
                  type="text"
                  placeholder="Например: Мастер и Маргарита, Булгаков"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Автор</label>
                <input
                  type="text"
                  placeholder="Имя автора"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Жанр</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.filter((c) => c !== "Все").map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Состояние</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option>Отличное</option>
                    <option>Хорошее</option>
                    <option>Среднее</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Описание</label>
                <textarea
                  rows={3}
                  placeholder="Расскажите о книге: год издания, язык, есть ли пометки..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Город</label>
                  <input
                    type="text"
                    placeholder="Москва"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Контакт для связи</label>
                <input
                  type="text"
                  placeholder="Телефон или Telegram"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                <Icon name="Camera" size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Добавить фото книги</p>
                <p className="text-xs text-muted-foreground/60 mt-1">до 5 фотографий</p>
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {publishing ? "Публикую..." : user ? "Опубликовать объявление 📚" : "Войдите, чтобы опубликовать"}
              </button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeSection === "profile" && (
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
                  {[
                    { icon: "Heart", label: "Избранное" },
                    { icon: "Settings", label: "Настройки" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} size={18} className="text-primary" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </button>
                  ))}
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
                    {myBooks.map((book, i) => (
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
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-border py-8 text-center mb-16 md:mb-0">
        <div className="text-2xl mb-2">📚</div>
        <p className="font-display text-lg text-foreground font-semibold">Добродел</p>
        <p className="text-xs text-muted-foreground mt-1">Книги находят новых читателей</p>
      </footer>

      <AuthModal />
    </div>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}