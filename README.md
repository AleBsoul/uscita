# Will You Be My Valentine? 

This project is designed to be an interactive webpage to ask someone to be your Valentine. Please use this code as inspiration.
---
## Respect Open-Source
I built this for **fun & learning**. If you fork or modify it:  
✔ **Use it for creativity, personal projects, or learning**  
✔ **Give proper credit when using it in public**  
✔ **Respect the original creator’s work**  
 




## How It Works 

This project consists of a simple webpage with a "Yes" and "No" button. When the user clicks the "No" button, the button text changes to a series of  messages, and the "Yes" button grows larger. If the user clicks the "Yes" button, they are redirected to a new page (`yes_page.html`).

### Features:
- **Interactive Buttons**: The "No" button cycles through , while the "Yes" button grows in size.
- **Responsive Design**: The webpage is designed to work on all screen sizes.

---

## How to Use 

1. **Download the Files**:
   - Clone this repository (servono `index.html`, `styles.css`, `script.js`, `yes_page.html`, `yes_page.js`, `yes_style.css` e la cartella `vendor/`).

2. **Open the Project**:
   - Apri `index.html` nel browser: la mail viene inviata con EmailJS dal browser, senza server.
   - Per una preview locale con un server statico, ad esempio:
     ```bash
     python3 -m http.server 8000
     ```
     poi apri `http://localhost:8000`.



---

## Appuntamento e notifica email

Nella pagina `yes_page.html` (dopo aver cliccato "Sì") si scelgono **data**, **ora** e **posto** dell'appuntamento. Alla conferma il browser invia i dati tramite **EmailJS** (`vendor/emailjs/`), che manda la mail al tuo indirizzo. Così la pagina funziona anche su hosting statico come GitHub Pages, senza backend.

Configurazione in `yes_page.js`:

```js
const EMAILJS_PUBLIC_KEY = '-OGn7hQuhz3_ZJoF3';
const EMAILJS_SERVICE_ID = 'service_qdi7d0c';
const EMAILJS_TEMPLATE_ID = 'template_4psp38h';
```

Il template EmailJS riceve le variabili `{{date}}` (es. "sabato 15 novembre 2026"), `{{date_short}}` (es. "15/11/2026"), `{{time}}` (es. "20:30") e `{{place}}`.

Le librerie usate dalla pagina sono incluse in `vendor/`: `flatpickr` (calendario in italiano) ed `emailjs` (invio mail). Per il sito pubblicato non serve alcun backend.

---


## Code Overview 

### Files:

- `index.html`: The main HTML file that structures the webpage.
- `styles.css`: The CSS file that styles the webpage.
- `script.js`: The JavaScript file that handles the button interactions.
- `yes_page.html`: The yes page that sturctures the webpage.
- `yes_style.css`: The css file that styles the yes webpage.
- `yes_page.js`: Calendario/orologio in italiano e invio della mail con EmailJS.
- `vendor/`: `flatpickr` (date/time picker) ed `emailjs` (invio mail), inclusi localmente.



### Key Functions:

- `handleNoClick()`: Changes the "No" button text and increases the size of the "Yes" button.
- `handleYesClick()`: Redirects the user to `yes_page.html`.

---

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

