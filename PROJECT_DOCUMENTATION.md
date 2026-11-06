# Website Phishing Detection System Using MERN Stack and Machine Learning
**Brand Name: PhishGuard**

---

## Project Overview
**PhishGuard** is a full-stack cybersecurity web application designed to identify whether a website URL is legitimate or phishing using Machine Learning (Random Forest Classifier).

Built for a 3rd-year B.Tech CSE capstone demonstration, the application bridges the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with a dedicated **Python Flask Machine Learning microservice** to deliver real-time URL heuristic inspection, threat classification, and interactive visual telemetry.

---

## Core Capabilities

- **Zero-Hour Threat Detection**: Evaluates URLs in real-time based on lexical and structural markers without relying solely on static blacklists.
- **Machine Learning Classification**: Uses Scikit-learn's **Random Forest Classifier** trained across 24 URL feature vectors.
- **Explainable Diagnostics**: Displays specific factors that contributed to a classification (such as IP address hosts, excessive subdomains, brand impersonation keywords, URL shortener masking).
- **Security Dashboard**: Real-time telemetry, threat breakdown pie charts, and 7-day scan timeline using Recharts.
- **User Authentication**: Secure bcrypt password hashing and JWT token-based session management.
- **Scan History & Audit Logs**: Searchable, filterable (Phishing/Legitimate), and manageable user scan records stored in MongoDB.
- **Cybersecurity Design**: Professional dark navy palette, high-contrast readability, clean SVG iconography, and responsive layouts across desktop and mobile.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, React Router v6 | Single Page Application (SPA), dynamic client routing |
| **Styling** | Modern CSS3 (Variables & Dark Theme) | Professional cybersecurity interface |
| **Data Visualization** | Recharts | Weekly activity bar charts and classification pie charts |
| **Backend API** | Node.js and Express.js | REST API gateway, validation, rate limiting |
| **Database** | MongoDB & Mongoose ODM | User accounts, scan history, and metrics persistence |
| **Authentication** | JSON Web Tokens (JWT) & bcrypt.js | Secure user authentication and password hashing |
| **ML Engine** | Python 3, Scikit-learn, NumPy | Feature extraction & Random Forest classification |
| **ML API** | Flask & Flask-CORS | REST endpoint (`/api/predict`) connecting Node.js to Python |

---

## Machine Learning Engine & Feature Extraction

The system extracts **24 distinct heuristic features** directly from candidate URLs:

1. **`url_length`**: Total character length (phishing links often embed long redirect chains).
2. **`num_dots`**: Frequency of dots (identifies excessive subdomain nesting).
3. **`num_hyphens`**: Hyphens used to mimic genuine brands (`paypal-security.com`).
4. **`num_underscores`**: Presence of underscore characters.
5. **`num_slashes`**: Deep path directory structures.
6. **`num_question_marks`**: Presence of complex query parameters.
7. **`num_equals`**: Key-value query count.
8. **`has_at_symbol`**: RFC exploit where `user@domain` leads to destination domain.
9. **`has_ip_address`**: Direct IPv4 address in domain instead of registered DNS name.
10. **`has_https`**: Verification of TLS/SSL protocol layer.
11. **`domain_length`**: Character count of hostname.
12. **`num_subdomains`**: Number of domain prefix levels.
13. **`has_double_slash`**: Double slash in path indicating redirect bypass.
14. **`has_dash_in_domain`**: Suspicious hyphenation within hostname.
15. **`is_url_shortener`**: Known shorteners (`bit.ly`, `tinyurl.com`, `t.co`, etc.).
16. **`has_suspicious_words`**: Keywords (`login`, `verify`, `banking`, `secure`, `update`, `account`).
17. **`num_digits`**: Numeric character frequency in URL.
18. **`special_char_count`**: Non-alphanumeric punctuation marks.
19. **`query_length`**: Character length of query string.
20. **`path_length`**: Character length of resource path.
21. **`has_hex`**: Hexadecimal URL percent-encoding (`%20`, `%2e`).
22. **`domain_tokens`**: Count of distinct word tokens in hostname.
23. **`digit_ratio_domain`**: Ratio of numeric digits to hostname length.
24. **`path_tokens`**: Count of segments in resource path.

### ML Classifier: Random Forest
- **Ensemble of 100 Decision Trees** (`n_estimators=100`, `max_depth=15`)
- Balanced class weighting to prevent skew
- Output includes binary classification (`phishing` vs `legitimate`), probabilistic confidence score, and scaled **Risk Score (0-100)**.

---

## Project Directory Structure

```
PhishGuard-AI/
├── ml-service/                  # Python Flask Machine Learning Service
│   ├── app.py                   # Flask REST API (:5001)
│   ├── feature_extractor.py     # 24 URL feature extraction logic
│   ├── train_model.py           # Generates dataset, trains & saves model
│   ├── requirements.txt         # Python dependencies
│   └── model/
│       └── phishing_model.pkl   # Serialized Random Forest model
│
├── server/                      # Node.js + Express REST API Gateway
│   ├── index.js                 # Express server entry point (:5000)
│   ├── package.json
│   ├── .env                     # Environment configuration
│   ├── middleware/
│   │   └── auth.js              # JWT validation middleware
│   ├── models/
│   │   ├── User.js              # User Mongoose schema & bcrypt hooks
│   │   └── ScanResult.js        # Scan history schema & indexing
│   └── routes/
│       ├── auth.js              # POST /signup, POST /login, GET /profile
│       ├── scan.js              # POST / (auth), POST /guest
│       ├── history.js           # GET /, DELETE /:id, DELETE /
│       └── dashboard.js         # GET /stats (aggregations & charts)
│
├── client/                      # React.js Frontend Application (:3000)
│   ├── package.json
│   ├── index.html               # Main HTML entry point
│   ├── public/
│   │   ├── favicon.svg          # PhishGuard Shield Logo
│   │   └── index.html
│   └── src/
│       ├── index.js & index.css # Dark navy theme design system
│       ├── App.js & App.jsx     # Application router & protected routes
│       ├── context/
│       │   └── AuthContext.js   # JWT authentication state provider
│       ├── components/
│       │   ├── Navbar.js & .css # Responsive navigation bar
│       │   └── Logo.js          # SVG Shield Logo
│       └── pages/
│           ├── Home.js & .css   # Overview, URL submission, system features
│           ├── Scanner.js & .css# URL inspection, risk meter, feature grid
│           ├── Dashboard.js     # Analytics, timeline bar chart, breakdown pie
│           ├── History.js       # Audit records, filter tabs, record deletion
│           ├── Login.js         # User login form
│           ├── Signup.js        # User registration form
│           └── About.js & .css  # System architecture & ML methodology
│
├── start_ml.bat                 # 1-Click launcher for Python ML service
├── start_server.bat             # 1-Click launcher for Express backend
├── start_client.bat             # 1-Click launcher for React frontend
├── start_all.bat                # 1-Click launcher for all 3 services
└── PROJECT_DOCUMENTATION.md     # Complete project documentation & guide
```

---

## Installation & Step-by-Step Execution Guide

### Prerequisites
1. **Node.js** (v16 or higher) & **npm** installed
2. **Python** (v3.8 or higher) & **pip** installed
3. **MongoDB** installed and running on port 27017 (or MongoDB Atlas connection string)

---

### Step 1: Set Up & Train the Machine Learning Service
Open a terminal in the `ml-service` directory:
```bash
cd ml-service
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Or Command Prompt:
.\venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Train the Random Forest Model (Generates model/phishing_model.pkl)
python train_model.py

# Start the Flask ML REST API
python app.py
```
> The ML API runs on `http://localhost:5001`.

---

### Step 2: Set Up & Start the Node.js Express Backend
Open a second terminal in the `server` directory:
```bash
cd server
npm install
node index.js
# Or: npm run dev
```
> The Express Server runs on `http://localhost:5000` and connects to MongoDB.

---

### Step 3: Set Up & Start the React Frontend
Open a third terminal in the `client` directory:
```bash
cd client
npm install
npm start
```
> The React app will open automatically at `http://localhost:3000`.

---

## API Reference

### ML Service (`http://localhost:5001`)
- `GET /api/health` - Verifies service and model status.
- `POST /api/predict` - Analyzes `{ "url": "https://example.com" }` and returns prediction, confidence, risk score, and suspicious features.

### Express Backend (`http://localhost:5000`)
- `POST /api/auth/signup` - Registers a user account.
- `POST /api/auth/login` - Authenticates user and issues a JWT token.
- `GET /api/auth/profile` - Retrieves authenticated user profile.
- `POST /api/scan` - Scans URL via ML service and saves result to MongoDB (requires JWT).
- `POST /api/scan/guest` - Public scan without saving to database.
- `GET /api/history` - Retrieves paginated scan history with filter by classification.
- `DELETE /api/history/:id` - Deletes a specific scan record.
- `DELETE /api/history` - Clears all records for the user.
- `GET /api/dashboard/stats` - Returns scan count, phishing rate, weekly timeline, and recent entries.

---

## Security Notice
PhishGuard provides probabilistic threat classification based on statistical machine learning analysis of URL structure. It does not navigate to or interact with target web servers to preserve client system safety.
