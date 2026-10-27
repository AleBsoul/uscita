const form = document.getElementById('appointmentForm');
const confirmButton = document.getElementById('confirmButton');
const confirmation = document.getElementById('confirmation');
const errorMessage = document.getElementById('errorMessage');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');

// EmailJS (funziona anche su GitHub Pages, senza server)
const EMAILJS_PUBLIC_KEY = '-OGn7hQuhz3_ZJoF3';
const EMAILJS_SERVICE_ID = 'service_qdi7d0c';
const EMAILJS_TEMPLATE_ID = 'template_4psp38h';

if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function hideConfirmation() {
    confirmation.hidden = true;
}

// Calendario e orologio sempre in italiano: gg/mm/aaaa e formato 24 ore,
// indipendentemente dalla lingua del browser.
const datePicker = flatpickr(dateInput, {
    locale: 'it',
    dateFormat: 'd/m/Y',
    minDate: 'today',
    disableMobile: true,
    allowInput: false,
    // Su schermi bassi il calendario si apre verso l'alto per restare visibile
    position: () => (window.innerHeight <= 640 ? 'above' : 'auto'),
    onChange: hideConfirmation,
});

const timePicker = flatpickr(timeInput, {
    locale: 'it',
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    minuteIncrement: 15,
    disableMobile: true,
    allowInput: false,
    onChange: hideConfirmation,
});

function pad(value) {
    return String(value).padStart(2, '0');
}

function formatDateLong(date) {
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateShort(date) {
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

function clearMessages() {
    errorMessage.textContent = '';
    errorMessage.hidden = true;
    hideConfirmation();
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();

    const selectedDate = datePicker.selectedDates[0];
    const selectedTime = timePicker.selectedDates[0];

    if (!selectedDate || !selectedTime) {
        showError('Scegli data e ora dell\'appuntamento.');
        return;
    }

    const place = document.getElementById('place').value.trim();

    if (!place) {
        return;
    }

    const time = `${pad(selectedTime.getHours())}:${pad(selectedTime.getMinutes())}`;
    const date = formatDateLong(selectedDate);
    const dateShort = formatDateShort(selectedDate);

    if (typeof emailjs === 'undefined') {
        showError('Libreria email non caricata. Controlla la connessione e ricarica la pagina.');
        return;
    }

    confirmButton.disabled = true;
    confirmButton.textContent = 'Invio in corso...';

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            date,
            date_short: dateShort,
            time,
            place,
            // Testo completo in un'unica variabile: utile se il template usa {{message}}
            message: `Appuntamento confermato!\n\nData: ${date}\nOra: ${time}\nPosto: ${place}`,
        });

        confirmation.hidden = false;
    } catch (error) {
        console.error('Invio email fallito:', error);
        const detail = error && error.text ? ` (${error.text})` : '';
        showError(`Invio email non riuscito${detail}. Riprova tra poco.`);
    } finally {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Conferma appuntamento';
    }
});
