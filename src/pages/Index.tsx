import { useState } from "react";
import { Section } from "@/components/dobrodel/types";
import Header from "@/components/dobrodel/Header";
import HomePage from "@/components/dobrodel/HomePage";
import CatalogSection from "@/components/dobrodel/CatalogSection";
import AddBookSection from "@/components/dobrodel/AddBookSection";
import ProfileSection from "@/components/dobrodel/ProfileSection";
import { AuthProvider } from "@/components/dobrodel/AuthContext";
import AuthModal from "@/components/dobrodel/AuthModal";

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  const handleAfterPublish = () => {
    setActiveSection("profile");
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1">
        {activeSection === "home" && (
          <HomePage onNavigate={setActiveSection} />
        )}

        {activeSection === "catalog" && (
          <CatalogSection />
        )}

        {activeSection === "add" && (
          <AddBookSection
            onNavigate={setActiveSection}
            onAfterPublish={handleAfterPublish}
          />
        )}

        {activeSection === "profile" && (
          <ProfileSection setActiveSection={setActiveSection} />
        )}
      </main>

      <footer className="bg-white border-t border-border py-8 text-center mb-16 md:mb-0">
        <div className="text-2xl mb-2">📚</div>
        <p className="font-display text-lg text-foreground font-semibold">Добродел</p>
        <p className="text-xs text-muted-foreground mt-1">Книги находят новых читателей</p>
      </footer>

      <AuthModal />
    </div>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
