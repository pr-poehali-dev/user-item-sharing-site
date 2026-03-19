export type Section = "home" | "catalog" | "add" | "profile";

export interface Item {
  id: number;
  title: string;
  category: string;
  size: string;
  condition: string;
  description: string;
  author: string;
  city: string;
  image: string;
  emoji: string;
}

export interface FormData {
  title: string;
  category: string;
  size: string;
  condition: string;
  description: string;
  city: string;
  name: string;
  phone: string;
}

export const MOCK_ITEMS: Item[] = [
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

export const CATEGORIES = ["Все", "Одежда", "Детское", "Книги", "Дом", "Спорт"];

export const STATS = [
  { value: "1 240", label: "вещей отдано", emoji: "🎁" },
  { value: "830", label: "добрых людей", emoji: "🤝" },
  { value: "15", label: "городов", emoji: "📍" },
];

export const NAV_ITEMS = [
  { id: "home" as Section, label: "Главная", icon: "Home" },
  { id: "catalog" as Section, label: "Каталог", icon: "Package" },
  { id: "add" as Section, label: "Отдать вещь", icon: "PlusCircle" },
  { id: "profile" as Section, label: "Профиль", icon: "User" },
];
