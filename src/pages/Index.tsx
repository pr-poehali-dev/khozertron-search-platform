import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/hozertron/Header";
import SearchBlock from "@/components/hozertron/SearchBlock";
import QuickAccess from "@/components/hozertron/QuickAccess";
import { Theme, SearchMode, ContentType, DateFilter } from "@/components/hozertron/types";

export default function Index() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("text");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [theme, setTheme] = useState<Theme>("light");
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showService, setShowService] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    root.classList.remove("dark", "system");
    if (t === "dark") root.classList.add("dark");
    if (t === "system") root.classList.add("system");
  };

  const toggleVoice = () => {
    setSearchMode("voice");
    setIsListening((v) => !v);
  };

  const handleImageClick = () => {
    setSearchMode("image");
    fileInputRef.current?.click();
  };

  const closeAll = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowService(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${contentType}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-background relative overflow-x-hidden"
      onClick={closeAll}
    >
      {/* Фоновый декор */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(28 55% 60%), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-48 -right-24 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(25 45% 45%), transparent 70%)" }}
        />
      </div>

      <Header
        theme={theme}
        applyTheme={applyTheme}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showService={showService}
        setShowService={setShowService}
        closeAll={closeAll}
      />

      {/* Центральный контент */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-24 md:pt-24">

        {/* Приветствие */}
        <div className="text-center mb-10 animate-fade-in">
          <h1
            className="text-4xl md:text-6xl font-black mb-3 leading-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Добро пожаловать<br />
            <span style={{ color: "hsl(var(--accent))" }}>в Хозертрон</span>
          </h1>
          <p className="text-base md:text-lg max-w-md mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Точная и быстрая информация — игры, видео, новости и многое другое
          </p>
        </div>

        <SearchBlock
          query={query}
          setQuery={setQuery}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          contentType={contentType}
          setContentType={setContentType}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          isListening={isListening}
          setIsListening={setIsListening}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          dragOver={dragOver}
          setDragOver={setDragOver}
          fileInputRef={fileInputRef}
          toggleVoice={toggleVoice}
          handleImageClick={handleImageClick}
          onSearch={handleSearch}
        />

        <QuickAccess />
      </main>
    </div>
  );
}