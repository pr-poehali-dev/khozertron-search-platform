import { useRef } from "react";
import Icon from "@/components/ui/icon";
import {
  SearchMode,
  ContentType,
  DateFilter,
  CONTENT_TYPES,
  DATE_FILTERS,
  MOCK_HISTORY,
} from "./types";

interface SearchBlockProps {
  query: string;
  setQuery: (v: string) => void;
  searchMode: SearchMode;
  setSearchMode: (v: SearchMode) => void;
  contentType: ContentType;
  setContentType: (v: ContentType) => void;
  dateFilter: DateFilter;
  setDateFilter: (v: DateFilter) => void;
  isListening: boolean;
  setIsListening: (v: boolean) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  toggleVoice: () => void;
  handleImageClick: () => void;
}

export default function SearchBlock({
  query,
  setQuery,
  searchMode,
  setSearchMode,
  contentType,
  setContentType,
  dateFilter,
  setDateFilter,
  isListening,
  showFilters,
  setShowFilters,
  dragOver,
  setDragOver,
  fileInputRef,
  toggleVoice,
  handleImageClick,
}: SearchBlockProps) {
  return (
    <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>

      {/* Переключатель режима */}
      <div className="flex justify-center gap-2 mb-4">
        {(
          [
            ["text", "Текст", "Type"],
            ["voice", "Голос", "Mic"],
            ["image", "Картинка", "ImagePlus"],
          ] as [SearchMode, string, string][]
        ).map(([mode, label, icon]) => (
          <button
            key={mode}
            onClick={() => {
              if (mode === "image") {
                handleImageClick();
              } else {
                setSearchMode(mode);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: searchMode === mode ? "hsl(var(--accent))" : "hsl(var(--card))",
              color: searchMode === mode ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
              boxShadow: searchMode === mode ? "0 4px 16px hsl(var(--accent) / 0.3)" : undefined,
            }}
          >
            <Icon name={icon as string} size={15} fallback="Circle" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Поисковая строка */}
      <div
        className="search-glow rounded-2xl border warm-shadow-lg overflow-hidden"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        {searchMode === "image" ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            onClick={handleImageClick}
            className="flex flex-col items-center justify-center py-10 px-6 cursor-pointer transition-colors"
            style={{ background: dragOver ? "hsl(var(--accent) / 0.08)" : undefined }}
          >
            <Icon name="ImagePlus" size={40} fallback="Image" />
            <p className="mt-3 font-medium" style={{ color: "hsl(var(--foreground))" }}>
              Перетащите картинку или нажмите для выбора
            </p>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>PNG, JPG, WEBP</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>
        ) : (
          <div className="flex items-center px-4 py-3 gap-3">
            <Icon name="Search" size={20} fallback="Circle" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === "voice" && isListening
                  ? "Слушаю..."
                  : "Найти игру, видео, новость..."
              }
              className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
              style={{ color: "hsl(var(--foreground))" }}
              onKeyDown={(e) => e.key === "Enter" && setShowFilters(true)}
            />

            <div className="flex items-center gap-1">
              {/* Фильтры */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: showFilters ? "hsl(var(--accent))" : "hsl(var(--muted))",
                  color: showFilters ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                }}
                title="Фильтры"
              >
                <Icon name="SlidersHorizontal" size={15} fallback="Filter" />
              </button>

              {/* Голос */}
              <button
                onClick={toggleVoice}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isListening ? "mic-pulse" : ""}`}
                style={{
                  background: isListening ? "hsl(var(--destructive))" : "hsl(var(--muted))",
                  color: isListening ? "hsl(var(--destructive-foreground))" : "hsl(var(--muted-foreground))",
                }}
                title={isListening ? "Остановить" : "Голосовой поиск"}
              >
                <Icon name={isListening ? "MicOff" : "Mic"} size={15} fallback="Mic" />
              </button>

              {/* Картинка */}
              <button
                onClick={handleImageClick}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                title="Поиск по картинке"
              >
                <Icon name="ImagePlus" size={15} fallback="Image" />
              </button>

              {/* Поиск */}
              <button
                className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:brightness-110"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              >
                Найти
              </button>
            </div>
          </div>
        )}

        {/* Фильтры */}
        {showFilters && searchMode !== "image" && (
          <div
            className="border-t px-4 py-4 animate-slide-down"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              ТИП КОНТЕНТА
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {CONTENT_TYPES.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setContentType(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: contentType === key ? "hsl(var(--accent))" : "hsl(var(--muted))",
                    color: contentType === key ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Icon name={icon as string} size={13} fallback="Circle" />
                  {label}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              ПЕРИОД
            </p>
            <div className="flex flex-wrap gap-2">
              {DATE_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDateFilter(key)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: dateFilter === key ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    color: dateFilter === key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* История поиска */}
      <div className="mt-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-xs font-semibold mb-2 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          НЕДАВНИЕ ПОИСКИ
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {MOCK_HISTORY.map((h) => (
            <button
              key={h}
              onClick={() => setQuery(h)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all hover:scale-105 warm-shadow"
              style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
            >
              <Icon name="Clock" size={12} fallback="Circle" />
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
