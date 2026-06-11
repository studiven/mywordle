const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
];

export default function MenuBar({ onBack, onStats, language, onLanguageChange }) {
  return (
    <div className="menu-bar">
      <button
        className="menu-back-btn"
        onClick={onBack}
        aria-label="Zurück zum Start"
        title="Zurück zum Start"
      >
        ←
      </button>

      <button
        className="menu-back-btn"
        onClick={onStats}
        aria-label="Statistik anzeigen"
        title="Statistik"
      >
        📊
      </button>

      <div className="menu-flags">
        {LANGUAGES.map(({ code, flag, label }) => (
          <button
            key={code}
            className={`menu-flag-btn ${language === code ? 'active' : ''}`}
            onClick={() => onLanguageChange(code)}
            aria-label={label}
            title={label}
          >
            {flag}
          </button>
        ))}
      </div>
    </div>
  );
}

export { LANGUAGES };
