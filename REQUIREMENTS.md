# Cerberus OS – Produktdefinition

> **Zweck:** Verbindliche Grundlage für alle Entwicklungs- und Designentscheidungen.  
> **Zielgruppe:** Entwickler, AI-Agenten, Stakeholder, Neuankömmlinge im Team.  
> **Stand:** August 2026 — On-Yee Yan (CEO, Cerberus Blue UG)  
> **Status:** V1-Frontend gebaut (SvelteKit/Svelte 5), läuft auf Mock-Daten. Offen: PocketBase-Anbindung + i18n. Siehe „Umsetzungsstand".

---

## Das eine Versprechen

**"Cerberus OS. Understand your water."**

Ein Operator öffnet die App und weiß in unter 30 Sekunden ob seine Wasserverhältnisse in Ordnung sind — und wenn nicht, wo er handeln muss.  
Ohne Studium. Ohne Nachkomma-Stellen. Die App spricht jeden an — Betreiber, Behörden, Forscher.

---

## Drei Produktgesetze (nicht verhandelbar)

Diese drei Prinzipien gelten für jede Entscheidung in jeder Version:

**1. Verständlichkeit im UI — Präzision beim Export**  
Die Rohdaten werden immer vollständig gespeichert (siehe Gesetz 2). Was der Nutzer im UI sieht, ist vereinfacht: maximal 1 Dezimalstelle, menschliche Einordnung ("normal / kritisch"), Ampelfarben statt Grenzwerttabellen. Beim CSV-Export kommen die vollen Rohdaten mit allen Nachkommastellen — für alle die tiefer in die Daten wollen: Forscher, Betreiber mit eigenen Auswertungen, Behörden mit eigenen Systemen, interne Pipeline-Kontrolle. Beispiel: UI zeigt "14.9°C — normal", CSV enthält "14.8823".  
Beim PDF-Export gelten dieselben Regeln wie im UI: Ampelfarben, vereinfachte Werte, klare Einordnung. Der PDF-Report ist für Betreiber und Behörden — er muss genauso lesbar sein wie die App selbst. Kein Excel-Look.

**2. Kein Datenverlust**  
Auch wenn die Boje nicht live sendet, speichert sie lokal weiter. Wenn Verbindung zurückkommt, synchronisiert sie nach. Die App zeigt immer an: wann wurde zuletzt gesendet, wie viele Datenpunkte sind gespeichert. Der Nutzer muss vertrauen können dass nichts verloren geht.

**3. Fouling-Warnung — vorausschauend**  
Falsche Daten durch Fouling sind das größte operationale Risiko (Quelle: Kasper Lenda Maarbjerg, DTU Aqua — unabhängig bestätigt durch Cawthron Institute NZ). Die App muss warnen bevor Daten unzuverlässig werden — nicht danach. Das ist unser technisches Alleinstellungsmerkmal.

---

## Das Datenmodell: Eine Boje, zwei Logs

Zentrale Erkenntnis aus dem Design-Prozess (Aug 2026), die die Produktdefinition prägt: **Eine HYDRA-Boje führt zwei parallele Aufzeichnungen.**

1. **Sensor-Log** — automatisch. Die Telemetrie der Sensoren (Temperatur, Sauerstoff, …). Regelmäßig, maschinell.
2. **Beobachtungs-Log** — menschlich. Feldbeobachtungen, geschrieben per Check-In: Foto des lebenden Objekts (Seetang, Muschel, Fisch), Notiz zu Wachstum und Fouling, Zeitstempel, GPS.

Der langfristige Produktwert — **größer als die reine Fouling-Divergenz** — ist die **Korrelation der beiden Logs**: Was tat die Umwelt, und was bedeutete das konkret für das, was an diesem Standort wächst (Kultur oder schädlicher Bewuchs)?

**Konsequenzen für V1:**
- Jeder Check-In ist ein vollwertiger, zeitgestempelter Datensatz (Foto, Notiz, GPS, Zeitstempel) — **kein Wegwerf-Eintrag**. (Das korrigiert die frühere Annahme „nur letzter Eintrag, keine Historie".)
- Die Boje zeigt ihre **Beobachtungs-Historie** als Liste, neueste zuerst.
- Das Datenmodell wird jetzt richtig aufgesetzt, damit die Korrelations-Ansicht (V2) **additiv** ist — kein Rewrite.

**Deployment-Typ.** Die Boje ist eine generische Wasserqualitäts-Sensorplattform, nicht seetang-gebunden. Jede Boje hat deshalb einen **Deployment-Typ** (Seetang / Muschel / Fisch / Renaturierung / Forschung / Sonstiges) und optional einen Freitext, was konkret dort wächst oder untersucht wird. (Ersetzt das frühere „Species/Cultivation"-Modell.)

---

## Tech Stack (verbindlich)

- **Framework:** SvelteKit, Svelte 5 (Runes: `$state`, `$derived`, `$props`, `$bindable`, Snippets)
- **Styling:** Tailwind CSS 4 (`@theme`-Tokens) + scoped Component-Styles — nativ responsiv, kein hard-coded mobile wrapper
- **Datenbank:** PocketBase (Schema immer via `docs/schema.json` prüfen, nie aus dem Gedächtnis)
- **i18n:** Paraglide — alle user-facing Texte in DE + EN
- **Karte:** svelte-maplibre (v2, Svelte-5-Linie) + maplibre-gl, Tiles über OpenFreeMap (kein API-Key nötig)
- **PWA:** Offline-fähig — Feldarbeit auf dem Wasser, kein stabiles Netz
- **Deployment:** Self-hosted VPS

---

## Design System

| Token | Wert | Verwendung |
|-------|------|-----------|
| Primärgrün | `#15e49a` | ok / online, primäre Aktion |
| Dunkel-Teal | `#11394b` | Karten, Header, Sheets |
| Sehr Dunkel | `#0d2c3b` / `#092b3a` | Foto-Hintergrund, tiefe Flächen |
| Gelb-Akzent | `#FBFFAA` | mid-Status, Gradient-Ende |
| Orange | `#FD7A4E` | **nur** Warnungen / Achtung |
| Hellblau | `#a9e3f4` | Hintergründe, Licht-unter-Wasser |
| Gradient | `#15e49a → #FBFFAA` (135°) | primäre Buttons (Add-FAB, Check-In) |
| Font Headings/Labels | Montserrat Alternates | |
| Font Body | Montserrat | |

**Ampel:** Grün `#15e49a` (ok), Gelb `#FBFFAA` (mid), Orange `#FD7A4E` (Achtung). Orange ist reserviert für echte Achtung-Zustände — nie für Cancel- oder neutrale Buttons (die sind leise/randlos).

**Parameterfarben** (fest pro Parameter, identisch über alle Bojen — damit die *Werte* den Vergleich tragen): Temperatur `#FFFFFF`, Sauerstoff `#FFB6ED`, TDS `#FFAA8E`, Redox `#B0ADFF`, Licht über Wasser `#FBFFAA`, Licht unter Wasser `#A9E3F4`.

Grundregeln: Mobile-first. Nativ responsiv. Keine hard-coded Breiten/Höhen.

---

## Umsetzungsstand (Stand Aug 2026)

Das **V1-Frontend ist gebaut** — als echter SvelteKit/Svelte-5-Code (kein Prototyp): beide Screens (Dashboard, Bojen-Detail) und alle vier Sheets (Check-In, Boje hinzufügen, Export, Parameter-Detail). Alle Komponenten kompilieren sauber (Svelte 5 Runes, TypeScript geprüft). Struktur komponentenweise aufgeteilt.

Der Build läuft aktuell auf **Mock-Daten**. Offen bis lauffähig mit echten Daten:
- **PocketBase anbinden** — die Mock-Datenschicht (`data/mock.ts`, `data/telemetry.ts`) durch echte Queries ersetzen (gleiche Typ-Signaturen → keine Komponenten-Änderung), Load-Funktionen ergänzen.
- **i18n (Paraglide)** — die aktuell englischen UI-Texte in DE/EN wrappen.
- **Pakete**: `svelte-maplibre` + `maplibre-gl` müssen installiert sein; der komplette `src`-Ordner kommt als Einheit ins Projekt.

Details zu Struktur und Übergabe: README im Svelte-Paket.

---

## V1 — Pilot-Tool (Herbst 2026, Flensburg)

**Ziel:** Daten sehen, verstehen, vertrauen können.

V1 ist kein Kundenprodukt. V1 ist ein internes Lernwerkzeug für den Flensburg-Pilot.  
Es gibt noch keine zahlenden Kunden. Wir bauen V1 um zu lernen was Nutzer wirklich brauchen.  
Jedes Feature das nicht direkt einem der drei Produktgesetze dient, kommt nicht in V1.

### Screens

**`/` — Dashboard**  
Alle Bojen auf einen Blick, in zwei Ebenen:

- **Karte** (OpenFreeMap via svelte-maplibre): jede Boje als Pin mit Status-Punkt; Site-Sprung-Control (unten rechts) zum Wechseln zwischen Standorten inkl. flyTo; eigene „you"-Position.
- **Bojenliste**, nach Standort gruppiert. Pro Boje eine Kapsel-Karte: Foto (letzte Beobachtung), Ampel-Status, Batteriestand, Deployment-/Subjekt-Zeile, „Last Check-In".
- **Fleet-Header**: Anzahl Bojen + kompakter Achtung-Chip (Warndreieck + Zahl, skaliert auf beliebige Ziffern, verschwindet bei 0).
- **+ (Boje hinzufügen)** als einzige Fleet-Aktion, unten mittig.

Keine Rohdaten, kein Graph auf dem Dashboard. Nur: läuft es, und wo ist was?

Ampel-Logik:
- Grün: alles normal, letzte Übertragung < 1h
- Gelb: Batterie niedrig (<20%) oder letzte Übertragung > 6h
- Rot/Orange: keine Verbindung > 24h oder Sensor-Ausfall

**`/buoy/[id]` — Die Boje (zwei Tabs)**  
Screen 2 ist **nicht** „der Daten-Screen" — er ist die Boje mit ihren zwei Logs. Segmentierte Umschaltung oben: **Data** und **Observations**.

**Tab „Data" — das Sensor-Log**  
Sechs Parameter, feste Reihenfolge, feste Farben:
1. Water Temperature (°C)
2. Dissolved Oxygen (mg/l)
3. Total Dissolved Solids (μS/cm)
4. Redox Potential (mV)
5. Light Above Water (lx)
6. Light Below Water (lx)

*(pH entfernt. Redox ist — anders als in der früheren Fassung notiert — in V1 enthalten. Zwei getrennte Licht-Parameter: über und unter Wasser.)*

Jeder Parameter als eigene Karte, in zwei Modi:
- **Snapshot** (Modus „now"): großer aktueller Wert + Trend („steigend / fallend / gleich").
- **Trend** (24h / 7d / 30d): Min/Max-Werte + Mini-Kurve + Zeitachse.

Ganze Karte tippbar → **Detail-Ansicht** (Bottom Sheet) mit großem Graph und **ziehbarem Scrubber** — jeder Punkt der Zeitreihe ablesbar.

**Zeitfilter:** now / 24h / 7d / 30d als Pills (Umschalter, kein Dropdown). Alle vier in V1.

**Vergleichsmodus** (im V1-Build enthalten): zwei Bojen nebeneinander, gleiche Parameter, gleiche Farben. Der **manuelle visuelle Fouling-Detektor** aus Gesetz 3 — der Nutzer sieht die Divergenz der Werte sofort. Die *automatische* Warnung bleibt V2. Im Vergleichsmodus ist der Observations-Tab inaktiv, weil Vergleich reine Telemetrie-Analyse ist (zwei Bojen) und Beobachtungen zu einer einzelnen Boje gehören.

**Tab „Observations" — das Beobachtungs-Log**  
Die Historie aller Check-Ins dieser Boje, neueste zuerst: Foto, Notiz, Zeitpunkt, Standort. Das ist der menschliche Teil der Bojen-Geschichte. Der Check-In-Button ist die **Compose-Aktion dieses Logs** und lebt nur hier (nicht im Data-Tab). Leerer Zustand, wenn noch keine Beobachtung existiert.

**Check-In (V1) — der Beobachtungs-Eintrag**  
Ein Check-In ist eine menschliche Feldbeobachtung, kein Wartungslog. Öffnet als Bottom Sheet über dem Bojen-Screen — kein neuer Screen, kein Navigationsverlust.

- Inhalt: **Foto (in V1, nicht mehr V2)**, Freitext-Notiz, Zeitstempel + GPS (automatisch, still erfasst).
- **Bojen-Auswahl im Sheet selbst:** die per GPS nächste Boje ist vorausgewählt und mit „nearest to you" markiert; jede Boje zeigt ihren Standort-Text zur Wiedererkennung im Feld („close by the cliffs"). Ein Tipp wechselt. So braucht der Check-In keinen Kontext von außen — von überall aufrufbar, weiß selbst, welche Boje gemeint ist.
- Jeder gespeicherte Check-In erscheint **sofort oben im Beobachtungs-Log**. „Letzten Check-In bearbeiten" korrigiert den neuesten Eintrag.
- Ruthlessly minimal: alles automatisch, keine optionalen Pflichtfelder. Ziel: **mühelos + sichtbar wachsend** — habituell durch Leichtigkeit, nicht durch Zwang oder Engagement-Tricks.

**Boje hinzufügen (V1)**  
Bottom Sheet: Name, **Deployment-Typ** (2×2-Raster mit Icons), **adaptives Subjekt-Feld** (Label passt sich dem Typ an — „Was wird kultiviert?" / „Was wird untersucht?"), Standort-Beschreibung. Batterie und Check-In werden automatisch gefüllt.

**Export (V1)**  
Export-Icon oben rechts im Bojen-Screen. Tippen → Bottom Sheet: Zeitraum wählen (24h / 7d / 30d / Alle / Benutzerdefiniert mit validierten Datumsfeldern) + Format wählen.  
Zwei Formate:  
— CSV: rohe Daten, alle Dezimalstellen, für alle die tiefer wollen (Forscher, Betreiber, interne Analyse)  
— PDF: designtes Dokument im App-Look (Cerberus-Header, Ampelfarben, Mini-Kurven, Metadaten)  
Export wird per E-Mail verschickt oder direkt als Download.

**Was V1 nicht hat:**  
Login, Compliance-Report, i18n (DE/EN), Fouling-Warnung-Algorithmus — und die **Korrelations-Ansicht** (Beobachtungen über die Umwelt-Graphen gelegt). Letzteres ist V2+, weil das saubere Ausrichten unregelmäßiger menschlicher Notizen an regelmäßige Sensor-Streams ein echtes Problem ist. V1 sammelt das Rohmaterial korrekt, damit V2 additiv ist.

Zwei bewusste Entscheidungen:
- **Foto beim Check-In ist jetzt in V1** (nicht mehr V2) — das Foto des lebenden Objekts ist der Kern des Beobachtungs-Logs.
- **Kein Bottom-Nav in V1:** die Zukunft ist offen, also committen wir kein Navigations-Skelett vorzeitig. Sheets sind self-contained; wenn später eine Nav-Bar kommt (Exports/Alerts/Fleet-Management als eigene Bereiche), wandert Check-In dorthin ohne Rework.

---

## V2 — Erstes Kundenprodukt (2026–2027)

**Ziel:** Erste zahlende Nutzer können die App selbst bedienen. Fouling-Warnung live.

### Neue Features in V2

**Fouling-Warnung (Gesetz 3)**  
Wenn zwei Sensoren im Grid divergieren → klare Aussage im UI:  
*"HYDRA 2 — Sensordaten möglicherweise unzuverlässig. Letzter zuverlässiger Wert: vor 3 Tagen."*  
Nicht als Rohdaten-Divergenz. Als verständliche Warnung. Vasilis baut den Algorithmus, die App zeigt das Ergebnis. (Der *manuelle* Vergleichsmodus dafür ist bereits in V1.)

**Korrelations-Ansicht (der größere USP)**  
Beobachtungen aus dem Check-In-Log über die Umwelt-Graphen gelegt: Was tat Sauerstoff/Licht/Temperatur, und was bedeutete das konkret für das Wachstum? Additiv auf dem V1-Datenmodell (zwei Logs). Echtes Design-Problem: unregelmäßige Beobachtungen an regelmäßige Streams ausrichten — deshalb bewusst nach V1.

**Auth**  
Login/Logout via PocketBase. Session-Management.

**Threshold Alerts (Pro-Feature)**  
Operator setzt eigene Grenzwerte: "Wenn Sauerstoff unter X mg/L fällt → Benachrichtigung".  
Das ist das €49/Monat Feature aus dem Pitch Deck.

**DE/EN Sprachumschaltung**  
Via Paraglide. Beide Sprachen vollständig.

### Screens neu in V2

- `/login` — Auth
- `/settings` — Nutzerprofil, Grenzwerte, Sprache, Benachrichtigungen

---

## V3 — Marktreifes Produkt (2027)

**Ziel:** Compliance-Nachweis. Skalierung auf 10–30 Bojen.

Was V3 enthält, wissen wir heute noch nicht vollständig.  
Das definiert der Pilot — nicht wir am Schreibtisch.

Was wir heute schon wissen:

**Compliance-Report**  
Automatisch generierter Nachweis pro Boje, exportierbar als PDF.  
Format richtet sich nach dem Markt: Norwegen (Mattilsynet) hat andere Anforderungen als Dänemark.  
Erst bauen wenn klar ist für welchen Markt zuerst.

**Stakeholder Guest View**  
Lesezugang für Behörden, Investoren, Partner — ohne eigenen Account.  
Steht bereits im Pitch Deck als Pro-Feature.

**Multi-Site Dashboard**  
Mehrere Standorte (Flensburg, Svendborg, Norwegen) in einer Ansicht.

---

## V4+ — Datenschicht (2027–2028)

Das ist die langfristige Vision aus dem Pitch Deck:  
*"Like Google Maps — but for what's happening beneath the surface."*

Jede Boje die ins Wasser geht baut einen proprietären Datensatz auf.  
Dieser Datensatz wird wertvoller mit jeder Boje, jedem Standort, jedem Jahr — und die Korrelation von Sensor- und Beobachtungs-Log (ab V2) ist ein Kern dieses Datensatzes.

Zukünftige Revenue-Streams:
- ML-Vorhersagemodelle (Wasserqualität, Algenwachstum, Saisonrisiken)
- Site Intelligence (wo lohnt sich eine Farm — bevor man investiert)
- Data Licensing (Behörden, Versicherungen, Aquakultur-Entwickler)

Cerberus OS ist in dieser Phase nicht mehr nur ein Dashboard.  
Es ist der Zugang zur Datenschicht.

---

## Offene technische Entscheidungen

| Thema | Status | Nächster Schritt |
|-------|--------|-----------------|
| Kommunikationsprotokoll HYDRA→Cloud | Offen | LoRa vs. NB-IoT evaluieren (Flensburg-Pilot entscheidet) |
| Fouling-Algorithmus | In Arbeit | Vasilis — DO-Rauschen + Sensor-Divergenz |
| Korrelation Beobachtung ↔ Umwelt | V2 | Ausrichtung unregelmäßiger Notizen an regelmäßige Streams |
| PocketBase-Anbindung | V1 offen | Mock-Datenschicht ersetzen, Load-Funktionen, `schema.json` |
| Push-Benachrichtigungen | V2 | Web Push API vs. PocketBase Hooks |
| PDF-Generation | V3 | Server-side (Puppeteer) vs. Client-side (jsPDF) |
| Offline-Sync-Strategie | V1 | Background Sync API |

---

## Nicht-funktionale Anforderungen

- **Offline:** Core-Funktionen ohne Netz nutzbar (Feldarbeit auf dem Wasser)
- **Performance:** Ladezeit < 3s auf mobilem 4G-Netz
- **Datenschutz:** DSGVO-konform, Daten auf eigenem VPS
- **Sprachen:** DE primär, EN sekundär — Paraglide
- **Barrierefreiheit (Basis):** Karten/Buttons per Tastatur bedienbar, ARIA-Labels, Reduced-Motion respektiert

---

## Marktkontext (Priorisierungsgrundlage)

- **Norwegen P1:** Mattilsynet verlangt Real-Time Reporting — konkreter Markt, sofort
- **Dänemark P2:** Permits aktuell unter Review — Markt in Vorbereitung, noch nicht reif
- **FIOLA / Industriewasser:** Anderer Use Case (inline, stationär) — separater Pilot, nicht in V1
- **Fouling:** Größtes operationales Problem aller Betreiber — unser USP muss das lösen
- **Preis:** Grid aus günstigen Einheiten ist nur Vorteil wenn Einzeleinheit wirklich günstig ist
