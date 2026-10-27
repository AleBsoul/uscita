const form = document.getElementById('appointmentForm');
const confirmButton = document.getElementById('confirmButton');
const confirmation = document.getElementById('confirmation');
const errorMessage = document.getElementById('errorMessage');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');

// Il server delle mail gira sempre sulla porta 3000: se la pagina è aperta
// con file:// o con Live Server (es. porta 5500) la richiesta va lì.
const API_URL = (window.location.protocol === 'file:' || window.location.port !== '3000')
    ? 'http://localhost:3000/api/appointment'
    : '/api/appointment';

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

function toISODate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

    const date = toISODate(selectedDate);
    const time = `${pad(selectedTime.getHours())}:${pad(selectedTime.getMinutes())}`;

    confirmButton.disabled = true;
    confirmButton.textContent = 'Invio in corso...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, time, place })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
            throw new Error(result.error || 'Invio email non riuscito.');
        }

        confirmation.hidden = false;
    } catch (error) {
        const isNetworkError = error instanceof TypeError;
        showError(
            isNetworkError
                ? 'Impossibile contattare il server delle mail. Avvialo con "npm start" nella cartella "node mail-sender" e lascia il terminale aperto.'
                : `${error.message} Controlla che il server sia avviato (npm start nella cartella "node mail-sender").`
        );
    } finally {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Conferma appuntamento';
    }
});
