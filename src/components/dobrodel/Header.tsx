import Icon from "@/components/ui/icon";
import { Section, NAV_ITEMS } from "./types";

interface HeaderProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <div>
              <span className="font-display text-2xl font-bold text-primary leading-none block">
                Добродел
              </span>
              <span className="text-xs text-muted-foreground">делимся с добром</span>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-lg">
        <div className="grid grid-cols-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
                activeSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="font-medium leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
