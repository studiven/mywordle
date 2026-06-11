// =============================================
// App.js — Änderungen für MenuBar (← / 📊 / Sprachen)
// =============================================

// 1. Import (oben bei den anderen imports):
import MenuBar from './components/MenuBar';
// Den alten Import von Stats bleibt, falls er für die Sidebar selbst
// noch gebraucht wird — nur der separate stats-button fällt weg.


// 2. Neuer State (bei den anderen useState-Deklarationen):
const [language, setLanguage] = useState(
  () => localStorage.getItem('wordle-language') || 'en'
);


// 3. Handler für Sprachwechsel:
function handleLanguageChange(code) {
  setLanguage(code);
  localStorage.setItem('wordle-language', code);
}


// 4. Im JSX — den alten stats-button ENTFERNEN und durch MenuBar ersetzen:
//
// VORHER:
//   {!statsOpen && (
//     <button className="stats-button" onClick={() => setStatsOpen(true)}>📊</button>
//   )}
//
// NACHHER (komplett ersetzen):
//   <MenuBar
//     onBack={backToStart}
//     onStats={() => setStatsOpen(true)}
//     language={language}
//     onLanguageChange={handleLanguageChange}
//   />
//
// Die Sidebar selbst (<aside className={`sidebar ...`}>) bleibt unverändert,
// nur der Trigger-Button kommt jetzt aus der MenuBar.


// 5. CSS: .stats-button Regel kann komplett aus App.css gelöscht werden,
// da der Button jetzt Teil von .menu-bar / .menu-back-btn ist.


// 6. Sprache an die Word-APIs weitergeben:
// In loadValidTargetWord(), dictionaryapi.dev URL anpassen:
//
//   const dictRes = await fetch(
//     `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`
//   );
//
// Für die random-words-api (kushcreates) — aktuell nur 'en' unterstützt.
// Für DE/FR/IT brauchst du eine andere Wortquelle (z.B. lokale JSON-Listen
// pro Sprache). Sag Bescheid wenn du das als nächstes angehen willst.
