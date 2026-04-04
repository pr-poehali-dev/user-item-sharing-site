import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Item } from "./types";
import func2url from "@/../backend/func2url.json";

const BOOKS_URL = (func2url as Record<string, string>)["books"];
const SESSION_KEY = "dobrodel_user";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (name: string) => void;
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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
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

  useEffect(() => {
    if (user) {
      loadMyBooks(user.email);
    }
  }, []);

  const login = (name: string, email: string) => {
    const u = { name, email };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setShowAuthModal(false);
    loadMyBooks(email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setMyBooks([]);
  };

  const updateProfile = (name: string) => {
    if (!user) return;
    const u = { ...user, name };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
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
    <AuthContext.Provider value={{ user, login, logout, updateProfile, showAuthModal, openAuth, closeAuth, myBooks, addMyBook, removeMyBook, loadMyBooks, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
