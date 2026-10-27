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
   - Clone this repository or download the `index.html`, `styles.css`,`yes_style.css`,`yes_page.html` and `script.js` files.

2. **Open the Project**:
   - Avvia il server dalla cartella `node mail-sender`:
     ```bash
     cd "node mail-sender"
     npm install
     npm start
     ```
   - Poi apri `http://localhost:3000` nel browser.
   - In alternativa puoi aprire `index.html` direttamente, ma per inviare la mail serve il server avviato.



---

## Appuntamento e notifica email

Nella pagina `yes_page.html` (dopo aver cliccato "Sì") si scelgono **data**, **ora** e **posto** dell'appuntamento. Alla conferma il browser invia i dati all'endpoint `POST /api/appointment` del server Express in `node mail-sender/server.js`, che manda una mail con i dettagli a `mailconf.mail`.

Le credenziali SMTP stanno in `node mail-sender/mailconf.json` (ignorato da git):

```json
{
    "user": "tua-mail@gmail.com",
    "pass": "password-app-gmail",
    "mail": "destinatario@gmail.com"
}
```

`pass` deve essere una **password per le app** Gmail, non la password normale dell'account.

---


## Code Overview 

### Files:

- `index.html`: The main HTML file that structures the webpage.
- `styles.css`: The CSS file that styles the webpage.
- `script.js`: The JavaScript file that handles the button interactions.
- `yes_page.html`: The yes page that sturctures the webpage.
- `yes_style.css`: The css file that styles the yes webpage.



### Key Functions:

- `handleNoClick()`: Changes the "No" button text and increases the size of the "Yes" button.
- `handleYesClick()`: Redirects the user to `yes_page.html`.

---

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

