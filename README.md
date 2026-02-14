TinkCare demo server

To run the local sensor/notify simulator (optional):

1. Install Node.js (>14)
2. In this folder run:

```bash
npm install
npm start
```

3. The server listens on `http://localhost:3000` and exposes:
- `GET /sensor` - returns JSON {dehydration, temp}
- `POST /notify` - accepts notification payload (simulated)

In the frontend, `script.js` will try to fetch `/sensor` (relative). If you run the server, open the site via a local web server or adjust fetch URL to `http://localhost:3000/sensor`.

Frontend testing notes:

- It's best to serve the frontend files via a simple static server rather than opening `index.html` directly to avoid CORS/fetch issues. Example using Node's `http-server` or Python:

```bash
# using http-server (npm)
npx http-server . -p 8080

# or Python 3
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

- Login: open `login.html` or click Login. Use any name; password: `password`. Check "Remember me" to persist.
- Dashboard: click `Start Auto Refresh` to fetch `/sensor` from the simulator (if running) or use simulated readings.
- Chatbot: ask keywords like `dehydration`, `heat`, `fever`, `vomit`, `dizziness`, `cramp`, `sunburn` to see detailed emoji-rich answers and pictures.
- Admin: login with Role=`admin` to access `admin.html`. The page lists saved users (demo) and can broadcast a simulated notification.

New features:
- Settings modal: open "Settings" from the topbar to configure auto-notify threshold, recovery threshold, weather polling interval, and toggles. Settings persist to `localStorage`.
- Weather: use "Check Weather" on dashboard or index to detect weather (via Open-Meteo) and get tailored precautions.
- CareBot improvements: renamed, expanded KB and reference images under `assets/`.
- Demo: open `demo.html` to simulate readings and test notification/threshold behavior.
