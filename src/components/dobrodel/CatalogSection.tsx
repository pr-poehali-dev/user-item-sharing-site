import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, Item } from "@/components/dobrodel/types";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/components/dobrodel/AuthContext";
import func2url from "@/../backend/func2url.json";

const BOOKS_URL = (func2url as Record<string, string>)["books"];

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
    image: String(b.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"),
    emoji: String(b.emoji || "📚"),
    contact: String(b.contact || ""),
    pickup: String(b.pickup || ""),
    ownerEmail: String(b.owner_email || ""),
  };
}

export default function CatalogSection() {
  const { user, isModerator } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Все");
  const [books, setBooks] = useState<Item[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    fetchBooks();
  }, [fetchBooks]);

  const handleModeratorDelete = async (bookId: number) => {
    if (!user || !isModerator) return;
    if (!confirm("Удалить это объявление?")) return;
    setDeletingId(bookId);
    try {
      const res = await fetch(`${BOOKS_URL}?id=${bookId}&moderator_email=${encodeURIComponent(user.email)}`, { method: "DELETE" });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== bookId));
      }
    } catch { /* network error */ }
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl font-bold text-foreground mb-1">Каталог книг</h1>
          {isModerator && (
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Модератор
            </span>
          )}
        </div>
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
            <div key={item.id} className="relative group">
              <ItemCard item={item} delay={i * 0.05} />
              {isModerator && (
                <button
                  onClick={() => handleModeratorDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="absolute top-3 right-3 z-10 bg-white border border-red-200 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm disabled:opacity-50"
                  title="Удалить объявление (модератор)"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-3">🔍</div>
          <p>В этой категории пока нет книг</p>
        </div>
      )}
    </div>
  );
}