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
  contact: string;
  pickup: string;
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
    title: "Мастер и Маргарита",
    category: "Художественная",
    size: "—",
    condition: "Хорошее",
    description: "Булгаков, издание 2003 года. Читана один раз, страницы чистые.",
    author: "Марина К.",
    city: "Москва",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "📖",
    contact: "@marina_books (Telegram)",
    pickup: "Москва, м. Таганская — в любой будний день с 18:00 до 20:00",
  },
  {
    id: 2,
    title: "Книги по психологии",
    category: "Психология",
    size: "—",
    condition: "Отличное",
    description: "3 книги: Фрейд, Юнг и Ялом. Читаны аккуратно, как новые.",
    author: "Алексей В.",
    city: "СПб",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "🧠",
    contact: "+7 921 000-11-22",
    pickup: "СПб, м. Василеостровская — выходные, договоримся по телефону",
  },
  {
    id: 3,
    title: "Гарри Поттер (1–3)",
    category: "Детская",
    size: "—",
    condition: "Хорошее",
    description: "Первые три части на русском. Немного потёрты углы, текст в отличном состоянии.",
    author: "Светлана Р.",
    city: "Казань",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "🧙",
    contact: "@svetlana_kazan (Telegram)",
    pickup: "Казань, р-н Ново-Савиновский — вечером в будни или в выходные",
  },
  {
    id: 4,
    title: "Сапиенс. Краткая история",
    category: "Научпоп",
    size: "—",
    condition: "Отличное",
    description: "Юваль Ной Харари. Как новая, прочитана один раз. Твёрдая обложка.",
    author: "Дмитрий С.",
    city: "Новосибирск",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "🌍",
    contact: "+7 913 555-77-88",
    pickup: "Новосибирск, Академгородок — суббота и воскресенье с 11:00 до 16:00",
  },
  {
    id: 5,
    title: "Учебник по высшей математике",
    category: "Учебники",
    size: "—",
    condition: "Среднее",
    description: "Алгебра и начала анализа, 10–11 класс. Есть пометки карандашом.",
    author: "Ольга М.",
    city: "Екатеринбург",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "📐",
    contact: "@olga_ekb (Telegram)",
    pickup: "Екатеринбург, м. Уральская — в любое удобное время, пишите заранее",
  },
  {
    id: 6,
    title: "Атлас. Расправь плечи",
    category: "Художественная",
    size: "—",
    condition: "Хорошее",
    description: "Айн Рэнд, перевод на русский. Три тома в одном. Отдам тому, кто осилит.",
    author: "Павел Т.",
    city: "Ростов-на-Дону",
    image: "https://cdn.poehali.dev/projects/d453d69b-d504-4ac0-9cc4-be00f49186ff/files/ef483b45-5577-4ad0-aeee-f4150a2683d2.jpg",
    emoji: "📚",
    contact: "+7 863 100-20-30",
    pickup: "Ростов-на-Дону, центр — будни после 19:00 или в выходные",
  },
];

export const CATEGORIES = ["Все", "Художественная", "Детская", "Психология", "Научпоп", "Учебники"];

export const STATS = [
  { value: "3 820", label: "книг отдано", emoji: "📚" },
  { value: "1 240", label: "читателей", emoji: "🤝" },
  { value: "28", label: "городов", emoji: "📍" },
];

export const NAV_ITEMS = [
  { id: "home" as Section, label: "Главная", icon: "Home" },
  { id: "catalog" as Section, label: "Каталог", icon: "BookOpen" },
  { id: "add" as Section, label: "Отдать книгу", icon: "PlusCircle" },
  { id: "profile" as Section, label: "Профиль", icon: "User" },
];