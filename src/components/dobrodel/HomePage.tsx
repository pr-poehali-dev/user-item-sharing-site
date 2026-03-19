import { Section, MOCK_ITEMS, STATS } from "./types";
import ItemCard from "./ItemCard";
import Icon from "@/components/ui/icon";
import { useAuth } from "./AuthContext";

interface HomePageProps {
  onNavigate: (section: Section) => void;
}

const SLOGANS = [
  { line1: "Подари книге новую жизнь", line2: "и нового друга." },
  { line1: "Добро начинается с буквы.", line2: "Поделись книгой." },
  { line1: "Живи книгами.", line2: "Делись историей." },
  { line1: "Вторая жизнь", line2: "каждой книги." },
  { line1: "Из рук в руки,", line2: "от сердца к сердцу." },
];

function getDailySlogan() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return SLOGANS[dayOfYear % SLOGANS.length];
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user, openAuth } = useAuth();
  const slogan = getDailySlogan();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-8 right-12 text-7xl opacity-10 rotate-12">🎁</div>
          <div className="absolute bottom-12 left-10 text-5xl opacity-10 -rotate-6">🌱</div>
          <div className="absolute top-1/2 left-1/3 text-4xl opacity-5">❤️</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-1.5 rounded-full text-sm text-primary font-medium mb-6 border border-primary/20">
            <span>🤝</span> Всё бесплатно — от сердца к сердцу
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
            {slogan.line1}<br />
            <span className="text-primary">{slogan.line2}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
            Здесь люди безвозмездно передают книги тем, кому они нужны.
            Дай книге новую жизнь — отдай её читателю.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("catalog")}
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Найти книгу
            </button>
            {user ? (
              <button
                onClick={() => onNavigate("add")}
                className="bg-white text-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:bg-muted transition-all border border-border shadow-sm"
              >
                Отдать книгу
              </button>
            ) : (
              <button
                onClick={openAuth}
                className="bg-white text-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:bg-muted transition-all border border-border shadow-sm"
              >
                Зарегистрироваться
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-1">{s.emoji}</div>
                <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 max-w-5xl mx-auto px-4">
        <h2 className="font-display text-4xl font-bold text-center mb-10 text-foreground">
          Как это работает?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "📖", title: "Добавь книгу", desc: "Укажи название, автора и состояние. Это займёт 2 минуты." },
            { step: "2", icon: "🔍", title: "Читатель находит", desc: "Люди видят объявление и пишут тебе напрямую." },
            { step: "3", icon: "🤗", title: "Передай с теплом", desc: "Договорись об удобном способе — лично или почтой." },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-6 border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-display font-bold text-xl mx-auto mb-3">
                {item.step}
              </div>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14 max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-4xl font-bold text-foreground">Свежие объявления</h2>
          <button
            onClick={() => onNavigate("catalog")}
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          >
            Все книги <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MOCK_ITEMS.slice(0, 3).map((item, i) => (
            <ItemCard key={item.id} item={item} delay={i * 0.1} />
          ))}
        </div>
      </section>
    </div>
  );
}