const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const mailconf = JSON.parse(fs.readFileSync(path.join(__dirname, "./mailconf.json"), "utf8"));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: mailconf.user,
    pass: mailconf.pass,
  },
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateIt(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Invia una mail con i dettagli dell'appuntamento confermato.
 * @param {{ date: string, time: string, place: string }} appointment
 */
async function sendAppointmentMail({ date, time, place }) {
  const formattedDate = formatDateIt(date);

  return transporter.sendMail({
    from: `<${mailconf.user}>`,
    to: mailconf.mail,
    replyTo: mailconf.mail,
    subject: `Appuntamento confermato — ${formattedDate} alle ${time}`,
    text: [
      "Appuntamento confermato! ❤️",
      "",
      `Data: ${formattedDate}`,
      `Ora: ${time}`,
      `Posto: ${place}`,
      "",
      "A presto!",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #d32f2f; margin-bottom: 8px;">Appuntamento confermato! ❤️</h2>
        <p style="margin-top: 0;">Ecco i dettagli:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Data:</strong> ${escapeHtml(formattedDate)}</li>
          <li><strong>Ora:</strong> ${escapeHtml(time)}</li>
          <li><strong>Posto:</strong> ${escapeHtml(place)}</li>
        </ul>
        <p>A presto!</p>
      </div>
    `,
  });
}

function verifyMailer() {
  return transporter.verify();
}

module.exports = { sendAppointmentMail, verifyMailer };
