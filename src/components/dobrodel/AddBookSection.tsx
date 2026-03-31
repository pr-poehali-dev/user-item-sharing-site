import { useState, useRef } from "react";
import { CATEGORIES, FormData, Item, Section } from "@/components/dobrodel/types";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/components/dobrodel/AuthContext";
import func2url from "@/../backend/func2url.json";

const BOOKS_URL = (func2url as Record<string, string>)["books"];
const UPLOAD_URL = (func2url as Record<string, string>)["upload-image"];

interface AddBookSectionProps {
  onNavigate: (section: Section) => void;
  onAfterPublish: () => void;
}

export default function AddBookSection({ onNavigate, onAfterPublish }: AddBookSectionProps) {
  const { user, openAuth, addMyBook } = useAuth();
  const [publishing, setPublishing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "Художественная",
    size: "",
    condition: "Хорошее",
    description: "",
    city: "",
    name: "",
    phone: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    setUploadingPhoto(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, content_type: photoFile.type }),
      });
      const data = await res.json();
      return data.url || null;
    } catch {
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePublish = async () => {
    if (!user) { openAuth(); return; }
    if (!formData.title) return;
    setPublishing(true);
    try {
      const imageUrl = await uploadPhoto();
      const res = await fetch(BOOKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          condition: formData.condition,
          description: formData.description,
          author_name: formData.name || user.name,
          city: formData.city,
          contact: formData.phone || user.email,
          pickup: formData.city || "Уточните при контакте",
          emoji: "📚",
          owner_email: user.email,
          image: imageUrl,
        }),
      });
      const data = await res.json();
      const newBook: Item = {
        id: data.id || Date.now(),
        title: formData.title,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        description: formData.description || "Без описания",
        author: formData.name || user.name,
        city: formData.city || "Не указан",
        image: imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        emoji: "📚",
        contact: formData.phone || user.email,
        pickup: formData.city || "Уточните при контакте",
        ownerEmail: user.email,
      };
      addMyBook(newBook);
      setFormData({ title: "", category: "Художественная", size: "", condition: "Хорошее", description: "", city: "", name: "", phone: "" });
      setPhotoPreview(null);
      setPhotoFile(null);
      onAfterPublish();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold text-foreground mb-1">Отдать книгу</h1>
        <p className="text-muted-foreground text-sm">Заполни форму — и объявление сразу увидят читатели</p>
      </div>
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1.5">Название книги *</label>
          <input
            type="text"
            placeholder="Например: Мастер и Маргарита, Булгаков"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Автор</label>
          <input
            type="text"
            placeholder="Имя автора"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Жанр</label>
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
            placeholder="Расскажите о книге: год издания, язык, есть ли пометки..."
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={photoPreview} alt="Фото книги" className="w-full h-48 object-cover" />
            <button
              onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-white/90 text-foreground text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white transition-colors border border-border"
            >
              Заменить
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors"
          >
            <Icon name="Camera" size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Добавить фото книги</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Выбрать из галереи</p>
          </button>
        )}

        <button
          onClick={handlePublish}
          disabled={publishing || uploadingPhoto}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploadingPhoto ? "Загружаю фото..." : publishing ? "Публикую..." : user ? "Опубликовать объявление 📚" : "Войдите, чтобы опубликовать"}
        </button>
      </div>
    </div>
  );
}
