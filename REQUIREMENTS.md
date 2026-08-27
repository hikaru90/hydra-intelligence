# Cerberus OS – Produktdefinition

> **Zweck:** Verbindliche Grundlage für alle Entwicklungs- und Designentscheidungen.  
> **Zielgruppe:** Entwickler, AI-Agenten, Stakeholder, Neuankömmlinge im Team.  
> **Stand:** August 2026 — On-Yee Yan (CEO, Cerberus Blue UG)

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

## Tech Stack (verbindlich)

- **Framework:** SvelteKit, Svelte 5 (Runes: `$state`, `$derived`, `$props`)
- **Styling:** Tailwind CSS 4 — nativ responsiv, kein hard-coded mobile wrapper
- **Datenbank:** PocketBase (Schema immer via `docs/schema.json` prüfen, nie aus dem Gedächtnis)
- **i18n:** Paraglide — alle user-facing Texte in DE + EN
- **Karte:** svelte-maplibre
- **PWA:** Offline-fähig — Feldarbeit auf dem Wasser, kein stabiles Netz
- **Deployment:** Self-hosted VPS

---

## Design System

| Token | Wert |
|-------|------|
| Primärfarbe (Grün) | `#15e49a` |
| Dunkel-Teal | `#11394b` |
| Dunkel | `#0d2e3d` |
| Akzent | `#65f2c6` |
| Weiß | `#ffffff` |
| Font Headings | Montserrat Alternates (`font-alt`) |
| Font Body | Montserrat |

Grundregeln: Mobile-first. Nativ responsiv. Keine hard-coded Breiten/Höhen.

---

## V1 — Pilot-Tool (Herbst 2026, Flensburg)

**Ziel:** Daten sehen, verstehen, vertrauen können.

V1 ist kein Kundenprodukt. V1 ist ein internes Lernwerkzeug für den Flensburg-Pilot.  
Es gibt noch keine zahlenden Kunden. Wir bauen V1 um zu lernen was Nutzer wirklich brauchen.  
Jedes Feature das nicht direkt einem der drei Produktgesetze dient, kommt nicht in V1.

### Screens

**`/` — Dashboard**  
Alle Bojen auf einen Blick. Pro Boje: Ampel-Status (grün/gelb/rot), letzter Messzeitpunkt, Batteriestand.  
Keine Rohdaten. Kein Graph. Nur: läuft es?

- Grün: alles normal, letzte Übertragung < 1h
- Gelb: Batterie niedrig (<20%) oder letzte Übertragung > 6h
- Rot: keine Verbindung > 24h oder Sensor-Ausfall

**`/buoy/[id]` — HYDRA Detail**  
Eine Boje, ihre aktuellen Messwerte — vereinfacht:

- Temperatur: Zahl + Einheit (z.B. "14.9°C")
- Sauerstoff: Balken mit Einordnung ("gut / kritisch")
- Salinity, Licht: Zahl + Einheit
- Letzter Sendezeitpunkt
- Anzahl gespeicherter Datenpunkte (macht Gesetz 2 sichtbar)

Jeder Parameter als eigene Karte mit Mini-Kurve (24h-Verlauf) und Prozentwert zur letzten 24h.  
Reihenfolge: Temperatur → Sauerstoff → Salinity → Licht → weitere.  
Redox Potential und pH in V1 weglassen — Forschungsparameter, kein operationaler Mehrwert.

**Vergleichsmodus (V2):**  
Zwei Bojen nebeneinander, gleiche Parameter, gleiche Reihenfolge.  
Wenn HYDRA 1 pH 8,1 zeigt und HYDRA 4 pH 6,2 — sieht der Nutzer die Divergenz sofort.  
Das ist der visuelle Fouling-Detektor aus Gesetz 3, ohne dass die App explizit warnen muss.  
Design bereits in Figma vorhanden — Links Einzelboje, Rechts Vergleichsmodus.

**Was V1 nicht hat:**  
Login, Export, Foto, Compliance-Report, i18n, Fouling-Warnung-Algorithmus.  
Das kommt wenn ein echter Nutzer danach fragt — nicht vorher.

---

## V2 — Erstes Kundenprodukt (2026–2027)

**Ziel:** Erste zahlende Nutzer können die App selbst bedienen. Fouling-Warnung live.

### Neue Features in V2

**Fouling-Warnung (Gesetz 3)**  
Wenn zwei Sensoren im Grid divergieren → klare Aussage im UI:  
*"HYDRA 2 — Sensordaten möglicherweise unzuverlässig. Letzter zuverlässiger Wert: vor 3 Tagen."*  
Nicht als Rohdaten-Divergenz. Als verständliche Warnung. Vasilis baut den Algorithmus, die App zeigt das Ergebnis.

**Auth**  
Login/Logout via PocketBase. Session-Management.

**Threshold Alerts (Pro-Feature)**  
Operator setzt eigene Grenzwerte: "Wenn Sauerstoff unter X mg/L fällt → Benachrichtigung".  
Das ist das €49/Monat Feature aus dem Pitch Deck.

**DE/EN Sprachumschaltung**  
Via Paraglide. Beide Sprachen vollständig.

**Einfacher CSV-Export**  
Zeitreihe pro Boje exportierbar. Für Forscher und erste Compliance-Nachweise.

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

**Foto-Dokumentation**  
Nutzer lädt Bild pro Boje hoch (Algen-Zustand, Fouling-Sichtprüfung).  
Nur wenn Pilotnutzer das aktiv fordern.

**Multi-Site Dashboard**  
Mehrere Standorte (Flensburg, Svendborg, Norwegen) in einer Ansicht.

---

## V4+ — Datenschicht (2027–2028)

Das ist die langfristige Vision aus dem Pitch Deck:  
*"Like Google Maps — but for what's happening beneath the surface."*

Jede Boje die ins Wasser geht baut einen proprietären Datensatz auf.  
Dieser Datensatz wird wertvoller mit jeder Boje, jedem Standort, jedem Jahr.

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
| Push-Benachrichtigungen | V2 | Web Push API vs. PocketBase Hooks |
| PDF-Generation | V3 | Server-side (Puppeteer) vs. Client-side (jsPDF) |
| Offline-Sync-Strategie | V1 | Background Sync API |

---

## Nicht-funktionale Anforderungen

- **Offline:** Core-Funktionen ohne Netz nutzbar (Feldarbeit auf dem Wasser)
- **Performance:** Ladezeit < 3s auf mobilem 4G-Netz
- **Datenschutz:** DSGVO-konform, Daten auf eigenem VPS
- **Sprachen:** DE primär, EN sekundär — Paraglide

---

## Marktkontext (Priorisierungsgrundlage)

- **Norwegen P1:** Mattilsynet verlangt Real-Time Reporting — konkreter Markt, sofort
- **Dänemark P2:** Permits aktuell unter Review — Markt in Vorbereitung, noch nicht reif
- **FIOLA / Industriewasser:** Anderer Use Case (inline, stationär) — separater Pilot, nicht in V1
- **Fouling:** Größtes operationales Problem aller Betreiber — unser USP muss das lösen
- **Preis:** Grid aus günstigen Einheiten ist nur Vorteil wenn Einzeleinheit wirklich günstig ist
