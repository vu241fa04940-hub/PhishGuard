import pickle
import numpy as np
import os
import random
import string
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from feature_extractor import extract_features

# Set seed for reproducibility
random.seed(42)
np.random.seed(42)

# --- Generate realistic URL datasets ---

LEGITIMATE_DOMAINS = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'github.com', 'stackoverflow.com', 'wikipedia.org', 'amazon.com',
    'microsoft.com', 'apple.com', 'netflix.com', 'reddit.com', 'dropbox.com',
    'spotify.com', 'adobe.com', 'salesforce.com', 'oracle.com', 'ibm.com',
    'coursera.org', 'udemy.com', 'khanacademy.org', 'medium.com', 'quora.com',
    'nytimes.com', 'bbc.com', 'cnn.com', 'reuters.com', 'theguardian.com',
    'paypal.com', 'ebay.com', 'walmart.com', 'target.com', 'bestbuy.com',
    'gitlab.com', 'bitbucket.org', 'npmjs.com', 'pypi.org', 'rubygems.org',
    'mozilla.org', 'python.org', 'reactjs.org', 'nodejs.org', 'vuejs.org'
]

PHISHING_PATTERNS = [
    'paypal-secure-login.{tld}',
    'account-verify-{word}.{tld}',
    '{brand}-customer-support.{tld}',
    'secure-{brand}-login.{tld}',
    '{brand}.login.{tld}',
    '{num}.{num}.{num}.{num}',
    '{word}-update-{word}.{tld}',
    'free-{word}-winner.{tld}',
]

BRANDS = ['paypal', 'amazon', 'ebay', 'microsoft', 'apple', 'google', 'netflix', 'bank']
TLDS = ['com', 'net', 'org', 'info', 'xyz', 'online', 'site', 'ru', 'cn', 'tk']
WORDS = ['secure', 'login', 'verify', 'update', 'account', 'confirm', 'restore', 'billing']

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def generate_legitimate_url():
    domain = random.choice(LEGITIMATE_DOMAINS)
    scheme = 'https'
    paths = [
        '', '/home', '/about', '/products', '/services', '/contact',
        '/blog', f'/article/{random_string(6)}', f'/user/{random_string(5)}',
        f'/category/{random.choice(["tech", "news", "science", "sports"])}',
        f'/search?q={random_string(5)}', f'/page/{random.randint(1, 100)}'
    ]
    path = random.choice(paths)
    return f'{scheme}://{domain}{path}'

def generate_phishing_url():
    techniques = random.randint(1, 7)
    brand = random.choice(BRANDS)
    word = random.choice(WORDS)
    tld = random.choice(TLDS)
    
    if techniques == 1:
        # IP address
        ip = f'{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}'
        path = f'/{brand}/login?redirect=account&verify=true&token={random_string(16)}'
        return f'http://{ip}{path}'
    elif techniques == 2:
        # Brand impersonation with extra subdomains
        subdomain = f'{brand}-secure.login.{random_string(5)}'
        return f'http://{subdomain}.{tld}/account/verify?user=admin&session={random_string(12)}'
    elif techniques == 3:
        # Long suspicious URL
        domain = f'{brand}-{word}-{random_string(8)}.{tld}'
        params = f'?redirect={random_string(20)}&token={random_string(30)}&session={random_string(15)}'
        return f'http://{domain}/login/secure/verify/account/update{params}'
    elif techniques == 4:
        # URL shortener style + redirect
        domain = f'{random_string(5)}.{tld}'
        return f'http://{domain}/go?url=http://{brand}-login.com/account&ref={random_string(10)}'
    elif techniques == 5:
        # @ symbol trick
        domain = f'{brand}-security.{tld}'
        return f'http://user@{domain}/login?verify=account&token={random_string(16)}'
    elif techniques == 6:
        # Hex/encoded URL
        domain = f'secure-{brand}-{random_string(6)}.{tld}'
        return f'http://{domain}/login%20verify%20account?pass={random_string(12)}&id={random.randint(1000,9999)}'
    else:
        # Lots of subdomains
        sub = '.'.join([random_string(4) for _ in range(random.randint(3, 5))])
        return f'http://{sub}.{brand}.{tld}/account/secure/login/verify?id={random_string(10)}'

print("Generating dataset...")
urls = []
labels = []

# Generate legitimate URLs
for _ in range(5000):
    urls.append(generate_legitimate_url())
    labels.append(0)  # legitimate

# Generate phishing URLs
for _ in range(5000):
    urls.append(generate_phishing_url())
    labels.append(1)  # phishing

print(f"Generated {len(urls)} URLs ({labels.count(0)} legitimate, {labels.count(1)} phishing)")

# Extract features
print("Extracting features...")
X = []
valid_labels = []
errors = 0

for i, (url, label) in enumerate(zip(urls, labels)):
    try:
        features, _ = extract_features(url)
        X.append(features)
        valid_labels.append(label)
    except Exception as e:
        errors += 1

print(f"Features extracted. Errors: {errors}")

X = np.array(X)
y = np.array(valid_labels)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train model
print("Training Random Forest Classifier...")
clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Phishing']))

# Save model
model_dir = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, 'phishing_model.pkl')

with open(model_path, 'wb') as f:
    pickle.dump(clf, f)

print(f"\nModel saved to: {model_path}")
print("Training complete! You can now run app.py")
