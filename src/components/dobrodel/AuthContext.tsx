import { createContext, useContext, useState, ReactNode } from "react";
import { Item } from "./types";
import func2url from "@/../backend/func2url.json";

const BOOKS_URL = (func2url as Record<string, string>)["books"];

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  myBooks: Item[];
  addMyBook: (book: Item) => void;
  removeMyBook: (id: number) => void;
  loadMyBooks: (email: string) => void;
  favorites: Item[];
  toggleFavorite: (item: Item) => void;
  isFavorite: (id: number) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [myBooks, setMyBooks] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<Item[]>([]);

  const loadMyBooks = (email: string) => {
    fetch(`${BOOKS_URL}?owner_email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const items: Item[] = data.map((b: Record<string, unknown>) => ({
            id: b.id as number,
            title: b.title as string,
            category: b.category as string,
            size: b.author_name as string,
            condition: b.condition as string,
            description: b.description as string,
            author: b.author_name as string,
            city: b.city as string,
            image: (b.image as string) || "",
            emoji: (b.emoji as string) || "📚",
            contact: b.contact as string,
            pickup: b.pickup as string,
            ownerEmail: b.owner_email as string,
          }));
          setMyBooks(items);
        }
      })
      .catch(() => {});
  };

  const login = (name: string, email: string) => {
    setUser({ name, email });
    setShowAuthModal(false);
    loadMyBooks(email);
  };

  const logout = () => {
    setUser(null);
    setMyBooks([]);
  };

  const openAuth = () => setShowAuthModal(true);
  const closeAuth = () => setShowAuthModal(false);
  const addMyBook = (book: Item) => setMyBooks((prev) => [book, ...prev]);
  const removeMyBook = (id: number) => setMyBooks((prev) => prev.filter((b) => b.id !== id));

  const toggleFavorite = (item: Item) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [item, ...prev]
    );
  };

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, openAuth, closeAuth, myBooks, addMyBook, removeMyBook, loadMyBooks, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}