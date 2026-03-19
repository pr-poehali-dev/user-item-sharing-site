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

export const MOCK_ITEMS: Item[] = [];

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