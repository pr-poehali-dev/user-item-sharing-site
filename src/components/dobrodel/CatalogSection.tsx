import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, Item } from "@/components/dobrodel/types";
import ItemCard from "@/components/dobrodel/ItemCard";
import Icon from "@/components/ui/icon";

const BOOKS_URL = "https://functions.poehali.dev/b3760fda-9d1b-466c-be33-dae1c5039801";

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

export default function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [books, setBooks] = useState<Item[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

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

  return (
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
  );
}
