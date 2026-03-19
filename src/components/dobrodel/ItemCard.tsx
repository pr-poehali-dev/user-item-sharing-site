import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Item } from "./types";

interface ItemCardProps {
  item: Item;
  delay?: number;
}

export default function ItemCard({ item, delay = 0 }: ItemCardProps) {
  const [showContact, setShowContact] = useState(false);

  const conditionColor: Record<string, string> = {
    Отличное: "bg-green-50 text-green-700 border-green-200",
    Хорошее: "bg-amber-50 text-amber-700 border-amber-200",
    Среднее: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <>
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
          <button
            onClick={() => setShowContact(true)}
            className="mt-3 w-full bg-primary text-primary-foreground py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all"
          >
            Хочу получить
          </button>
        </div>
      </div>

      {/* Модальное окно с контактами */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowContact(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-3xl">{item.emoji}</span>
                <h2 className="font-display text-xl font-bold text-foreground mt-1">{item.title}</h2>
                <p className="text-xs text-muted-foreground">Отдаёт: {item.author}</p>
              </div>
              <button
                onClick={() => setShowContact(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-primary/8 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Icon name="Phone" size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Как связаться</span>
                </div>
                <p className="text-sm font-medium text-foreground">{item.contact}</p>
              </div>

              <div className="bg-muted/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon name="MapPin" size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Где и когда забрать</span>
                </div>
                <p className="text-sm text-foreground">{item.pickup}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Напишите владельцу заранее, чтобы договориться о встрече
            </p>

            <button
              onClick={() => setShowContact(false)}
              className="mt-4 w-full border border-border py-2.5 rounded-full text-sm font-medium text-foreground hover:bg-muted transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
