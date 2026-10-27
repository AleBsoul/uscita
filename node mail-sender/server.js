const path = require("path");
const express = require("express");
const { sendAppointmentMail, verifyMailer } = require("./mail");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..");

// Solo i file del sito sono serviti: mailconf.json e il resto della cartella restano privati.
const PUBLIC_FILES = new Set([
  "index.html",
  "styles.css",
  "script.js",
  "yes_page.html",
  "yes_style.css",
  "yes_page.js",
]);

app.use(express.json({ limit: "10kb" }));

// Libreria locale per il calendario italiano
app.use(
  "/vendor/flatpickr",
  express.static(path.join(PUBLIC_DIR, "vendor", "flatpickr"), { dotfiles: "deny" })
);

// Consente le richieste anche aprendo la pagina con file://
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Semplice limite: max 5 conferme ogni 10 minuti per IP
const attempts = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const ip = req.ip;
  const recent = (attempts.get(ip) || []).filter((t) => now - t < windowMs);

  if (recent.length >= 5) {
    return res.status(429).json({ ok: false, error: "Troppe richieste, riprova tra qualche minuto." });
  }

  recent.push(now);
  attempts.set(ip, recent);
  next();
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

app.post("/api/appointment", rateLimit, async (req, res) => {
  const { date, time, place } = req.body || {};

  if (
    typeof date !== "string" ||
    !isValidDate(date) ||
    typeof time !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    typeof place !== "string" ||
    place.trim().length === 0 ||
    place.trim().length > 200
  ) {
    return res.status(400).json({ ok: false, error: "Dati dell'appuntamento non validi." });
  }

  try {
    await sendAppointmentMail({ date, time, place: place.trim() });
    res.json({ ok: true });
  } catch (error) {
    console.error("Invio email fallito:", error);
    res.status(502).json({ ok: false, error: "Invio email non riuscito." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.get("/:file", (req, res, next) => {
  if (!PUBLIC_FILES.has(req.params.file)) {
    return next();
  }
  res.sendFile(path.join(PUBLIC_DIR, req.params.file));
});

app.listen(PORT, () => {
  console.log(`Sito disponibile su http://localhost:${PORT}`);
  verifyMailer()
    .then(() => console.log("Credenziali SMTP valide."))
    .catch((error) => console.error("Attenzione, credenziali SMTP non valide:", error.message));
});
