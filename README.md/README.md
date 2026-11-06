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

---

## Installation & Step-by-Step Execution Guide

### Prerequisites
1. **Node.js** (v16+) & **npm** installed
2. **Python** (v3.8+) & **pip** installed
3. **MongoDB** installed and running on port 27017

---

### Step 1: Set Up & Train the Machine Learning Service
```bash
cd ml-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
python app.py
```
> The ML API runs on `http://localhost:5001`.

---

### Step 2: Set Up & Start the Node.js Express Backend
```bash
cd server
npm install
node index.js
```
> The Express Server runs on `http://localhost:5000`.

---

### Step 3: Set Up & Start the React Frontend
```bash
cd client
npm install
npm start
```
> The React app will open automatically at `http://localhost:3000`.
