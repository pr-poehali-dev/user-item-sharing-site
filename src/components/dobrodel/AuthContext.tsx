import { createContext, useContext, useState, ReactNode } from "react";
import { Item } from "./types";

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

  const login = (name: string, email: string) => {
    setUser({ name, email });
    setShowAuthModal(false);
  };

  const logout = () => setUser(null);
  const openAuth = () => setShowAuthModal(true);
  const closeAuth = () => setShowAuthModal(false);
  const addMyBook = (book: Item) => setMyBooks((prev) => [book, ...prev]);

  const toggleFavorite = (item: Item) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [item, ...prev]
    );
  };

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, openAuth, closeAuth, myBooks, addMyBook, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
