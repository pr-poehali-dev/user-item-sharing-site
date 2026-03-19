import { useState } from "react";
import { Section, MOCK_ITEMS, CATEGORIES, STATS, NAV_ITEMS, FormData, Item } from "@/components/dobrodel/types";
import Header from "@/components/dobrodel/Header";
import HomePage from "@/components/dobrodel/HomePage";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";
import { AuthProvider, useAuth } from "@/components/dobrodel/AuthContext";
import AuthModal from "@/components/dobrodel/AuthModal";

function AppContent() {
  const { user, openAuth, myBooks, addMyBook } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [profileTab, setProfileTab] = useState<"menu" | "mybooks">("menu");
  const [activeCategory, setActiveCategory] = useState("Все");
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

  const filteredItems =
    activeCategory === "Все"
      ? MOCK_ITEMS
      : MOCK_ITEMS.filter((i) => i.category === activeCategory);

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
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item, i) => (
                <ItemCard key={item.id} item={item} delay={i * 0.05} />
              ))}
            </div>
            {filteredItems.length === 0 && (
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
                onClick={() => {
                  if (!user) { openAuth(); return; }
                  if (!formData.title) return;
                  const newBook: Item = {
                    id: Date.now(),
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
                }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {user ? "Опубликовать объявление 📚" : "Войдите, чтобы опубликовать"}
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
                  {[
                    { icon: "Heart", label: "Избранное" },
                    { icon: "MessageCircle", label: "Сообщения" },
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