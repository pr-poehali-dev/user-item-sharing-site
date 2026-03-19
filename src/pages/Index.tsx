import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "catalog" | "add" | "profile";

const MOCK_ITEMS = [
  {
    id: 1,
    title: "Детские ботинки",
    category: "Детское",
    size: "22",
    condition: "Хорошее",
    description: "Тёплые зимние ботиночки, носили один сезон. Очень мало б/у.",
    author: "Марина К.",
    city: "Москва",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/dafa7948-c53c-4ee9-a63a-82beac8040ad.jpg",
    emoji: "👟",
  },
  {
    id: 2,
    title: "Книги по психологии",
    category: "Книги",
    size: "—",
    condition: "Отличное",
    description: "3 книги: Фрейд, Юнг и Ялом. Читаны аккуратно, как новые.",
    author: "Алексей В.",
    city: "СПб",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "📚",
  },
  {
    id: 3,
    title: "Пальто женское",
    category: "Одежда",
    size: "M",
    condition: "Хорошее",
    description: "Бежевое пальто, осень-весна. Размер M. Отдам тому, кто нуждается.",
    author: "Светлана Р.",
    city: "Казань",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/dafa7948-c53c-4ee9-a63a-82beac8040ad.jpg",
    emoji: "🧥",
  },
  {
    id: 4,
    title: "Конструктор LEGO",
    category: "Детское",
    size: "—",
    condition: "Хорошее",
    description: "Большой набор, все детали на месте. Инструкция сохранена.",
    author: "Дмитрий С.",
    city: "Новосибирск",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "🧱",
  },
  {
    id: 5,
    title: "Посуда кухонная",
    category: "Дом",
    size: "—",
    condition: "Хорошее",
    description: "Кастрюля, сковорода, пара тарелок. Переезжаю — не нужно.",
    author: "Ольга М.",
    city: "Екатеринбург",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/dafa7948-c53c-4ee9-a63a-82beac8040ad.jpg",
    emoji: "🍳",
  },
  {
    id: 6,
    title: "Велосипед подростковый",
    category: "Спорт",
    size: '24"',
    condition: "Среднее",
    description: "Горный велосипед, требует мелкого ремонта цепи. Отдам бесплатно.",
    author: "Павел Т.",
    city: "Ростов-на-Дону",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "🚲",
  },
];

const CATEGORIES = ["Все", "Одежда", "Детское", "Книги", "Дом", "Спорт"];

const STATS = [
  { value: "1 240", label: "вещей отдано", emoji: "🎁" },
  { value: "830", label: "добрых людей", emoji: "🤝" },
  { value: "15", label: "городов", emoji: "📍" },
];

const nav = [
  { id: "home" as Section, label: "Главная", icon: "Home" },
  { id: "catalog" as Section, label: "Каталог", icon: "Package" },
  { id: "add" as Section, label: "Отдать вещь", icon: "PlusCircle" },
  { id: "profile" as Section, label: "Профиль", icon: "User" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [formData, setFormData] = useState({
    title: "",
    category: "Одежда",
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setActiveSection("home")}
            className="flex items-center gap-2"
          >
            <span className="text-3xl">🌿</span>
            <div>
              <span className="font-display text-2xl font-bold text-primary leading-none block">
                Добродел
              </span>
              <span className="text-xs text-muted-foreground">делимся с добром</span>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HOME */}
        {activeSection === "home" && (
          <div>
            <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 py-16 md:py-24">
              <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute top-8 right-12 text-7xl opacity-10 rotate-12">🎁</div>
                <div className="absolute bottom-12 left-10 text-5xl opacity-10 -rotate-6">🌱</div>
                <div className="absolute top-1/2 left-1/3 text-4xl opacity-5">❤️</div>
              </div>
              <div className="max-w-5xl mx-auto px-4 text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-1.5 rounded-full text-sm text-primary font-medium mb-6 border border-primary/20">
                  <span>🤝</span> Всё бесплатно — от сердца к сердцу
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
                  Отдай вещи тем,<br />
                  <span className="text-primary">кто нуждается</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
                  Здесь люди безвозмездно передают одежду, книги, игрушки и всё,
                  что может пригодиться другим.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setActiveSection("catalog")}
                    className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Найти вещи
                  </button>
                  <button
                    onClick={() => setActiveSection("add")}
                    className="bg-white text-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:bg-muted transition-all border border-border shadow-sm"
                  >
                    Отдать вещь
                  </button>
                </div>
              </div>
            </section>

            <section className="py-10 bg-white border-b border-border">
              <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {STATS.map((s, i) => (
                    <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="text-3xl mb-1">{s.emoji}</div>
                      <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
                      <div className="text-sm text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-14 max-w-5xl mx-auto px-4">
              <h2 className="font-display text-4xl font-bold text-center mb-10 text-foreground">
                Как это работает?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: "1", icon: "📦", title: "Добавь объявление", desc: "Опиши вещь и укажи город. Это займёт 2 минуты." },
                  { step: "2", icon: "🔍", title: "Нуждающийся находит", desc: "Люди видят объявление и пишут тебе напрямую." },
                  { step: "3", icon: "🤗", title: "Передай с теплом", desc: "Договорись об удобном способе — лично или почтой." },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-2xl p-6 border border-border text-center hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-display font-bold text-xl mx-auto mb-3">
                      {item.step}
                    </div>
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="pb-14 max-w-5xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-4xl font-bold text-foreground">Свежие объявления</h2>
                <button
                  onClick={() => setActiveSection("catalog")}
                  className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                >
                  Все вещи <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {MOCK_ITEMS.slice(0, 3).map((item, i) => (
                  <ItemCard key={item.id} item={item} delay={i * 0.1} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CATALOG */}
        {activeSection === "catalog" && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Каталог вещей</h1>
              <p className="text-muted-foreground text-sm">Всё бесплатно. Просто напишите хозяину</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по вещам..."
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
                <p>В этой категории пока нет вещей</p>
              </div>
            )}
          </div>
        )}

        {/* ADD */}
        {activeSection === "add" && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Отдать вещь</h1>
              <p className="text-muted-foreground text-sm">Заполни форму — и объявление сразу увидят люди</p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <div>
                <label className="block text-sm font-medium mb-1.5">Название вещи *</label>
                <input
                  type="text"
                  placeholder="Например: Детская куртка, размер 110"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Категория</label>
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
                  placeholder="Расскажите о вещи подробнее: размер, материал, почему отдаёте..."
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
                <p className="text-sm text-muted-foreground">Добавить фото вещи</p>
                <p className="text-xs text-muted-foreground/60 mt-1">до 5 фотографий</p>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Опубликовать объявление 🌿
              </button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeSection === "profile" && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Профиль</h1>
              <p className="text-muted-foreground text-sm">Ваши объявления и история</p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 mb-4 text-center shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
                🌿
              </div>
              <h2 className="font-semibold text-lg">Гость</h2>
              <p className="text-sm text-muted-foreground mb-4">Войдите, чтобы управлять объявлениями</p>
              <button className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all">
                Войти или зарегистрироваться
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { val: "0", label: "отдано", icon: "Gift" },
                { val: "0", label: "получено", icon: "Heart" },
                { val: "0", label: "активных", icon: "Package" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
                  <Icon name={s.icon} size={20} className="mx-auto text-primary mb-1" />
                  <div className="font-display text-2xl font-bold text-foreground">{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              {[
                { icon: "Package", label: "Мои объявления" },
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
          </div>
        )}
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-lg">
        <div className="grid grid-cols-4">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
                activeSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="font-medium leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <footer className="bg-white border-t border-border py-8 text-center mb-16 md:mb-0">
        <div className="text-2xl mb-2">🌿</div>
        <p className="font-display text-lg text-foreground font-semibold">Добродел</p>
        <p className="text-xs text-muted-foreground mt-1">Делимся добром — вещи находят новый дом</p>
      </footer>
    </div>
  );
}

function ItemCard({ item, delay = 0 }: { item: (typeof MOCK_ITEMS)[0]; delay?: number }) {
  const conditionColor: Record<string, string> = {
    Отличное: "bg-green-50 text-green-700 border-green-200",
    Хорошее: "bg-amber-50 text-amber-700 border-amber-200",
    Среднее: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 right-2 text-2xl">{item.emoji}</span>
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-full text-foreground">
          {item.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${conditionColor[item.condition] || ""}`}>
            {item.condition}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="MapPin" size={11} />
            {item.city}
          </span>
        </div>
        <button className="mt-3 w-full bg-primary text-primary-foreground py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all">
          Хочу получить
        </button>
      </div>
    </div>
  );
}