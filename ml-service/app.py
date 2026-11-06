from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import re
import urllib.parse
from feature_extractor import extract_features

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'phishing_model.pkl')
model = None

def load_model():
    global model
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully")
    except FileNotFoundError:
        print("Model not found. Please run train_model.py first.")
        model = None

# Attempt initial model load
load_model()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url'].strip()
    if not url:
        return jsonify({'error': 'URL cannot be empty'}), 400
    
    # Add scheme if missing
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    
    if model is None:
        return jsonify({'error': 'ML model not loaded. Run train_model.py first.'}), 503
    
    try:
        features, feature_dict = extract_features(url)
        features_array = np.array(features).reshape(1, -1)
        
        prediction_num = model.predict(features_array)[0]
        probabilities = model.predict_proba(features_array)[0]
        
        # 1 = phishing, 0 = legitimate
        is_phishing = bool(prediction_num == 1)
        confidence = float(probabilities[1] if is_phishing else probabilities[0])
        risk_score = int(probabilities[1] * 100)
        
        # Identify suspicious features
        suspicious = []
        if feature_dict['has_ip_address']:
            suspicious.append('Contains IP address instead of domain name')
        if feature_dict['url_length'] > 75:
            suspicious.append(f'Unusually long URL ({feature_dict["url_length"]} characters)')
        if not feature_dict['has_https']:
            suspicious.append('Not using HTTPS (insecure connection)')
        if feature_dict['num_subdomains'] > 3:
            suspicious.append(f'Too many subdomains ({feature_dict["num_subdomains"]})')
        if feature_dict['has_at_symbol']:
            suspicious.append('Contains @ symbol (common phishing trick)')
        if feature_dict['has_double_slash']:
            suspicious.append('Contains // redirect in URL path')
        if feature_dict['has_dash_in_domain']:
            suspicious.append('Domain contains hyphens (suspicious)')
        if feature_dict['is_url_shortener']:
            suspicious.append('Uses URL shortening service')
        if feature_dict['num_dots'] > 4:
            suspicious.append(f'Too many dots in URL ({feature_dict["num_dots"]})')
        if feature_dict['has_suspicious_words']:
            suspicious.append('Contains suspicious keywords (login, secure, account, verify, etc.)')
        if feature_dict['special_char_count'] > 5:
            suspicious.append(f'High number of special characters ({feature_dict["special_char_count"]})')
        
        return jsonify({
            'prediction': 'phishing' if is_phishing else 'legitimate',
            'confidence': round(confidence, 4),
            'risk_score': risk_score,
            'features': feature_dict,
            'suspicious_features': suspicious,
            'url': url
        })
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5001, debug=True)
