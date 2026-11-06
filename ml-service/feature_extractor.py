import re
import urllib.parse
from urllib.parse import urlparse

URL_SHORTENERS = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd',
    'buff.ly', 'adf.ly', 'tiny.cc', 'rebrand.ly', 'cutt.ly', 'short.io'
]

SUSPICIOUS_WORDS = [
    'login', 'signin', 'account', 'secure', 'verify', 'update', 'confirm',
    'banking', 'paypal', 'ebay', 'amazon', 'microsoft', 'apple', 'google',
    'password', 'credential', 'free', 'winner', 'prize', 'click', 'urgent',
    'suspended', 'limited', 'restore', 'validate', 'webscr', 'cmd'
]

def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    path = parsed.path.lower()
    full_url = url.lower()
    
    # Remove port if present
    if ':' in domain:
        domain = domain.split(':')[0]
    
    # Feature 1: URL Length
    url_length = len(url)
    
    # Feature 2: Number of dots
    num_dots = url.count('.')
    
    # Feature 3: Number of hyphens
    num_hyphens = url.count('-')
    
    # Feature 4: Number of underscores
    num_underscores = url.count('_')
    
    # Feature 5: Number of slashes
    num_slashes = url.count('/')
    
    # Feature 6: Number of question marks
    num_question_marks = url.count('?')
    
    # Feature 7: Number of equals signs
    num_equals = url.count('=')
    
    # Feature 8: Number of @ symbols
    has_at_symbol = int('@' in url)
    
    # Feature 9: Has IP address
    ip_pattern = re.compile(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b')
    has_ip_address = int(bool(ip_pattern.search(domain)))
    
    # Feature 10: Has HTTPS
    has_https = int(parsed.scheme == 'https')
    
    # Feature 11: Domain length
    domain_length = len(domain)
    
    # Feature 12: Number of subdomains
    domain_parts = [p for p in domain.split('.') if p]
    num_subdomains = max(0, len(domain_parts) - 2)
    
    # Feature 13: Has double slash in path
    has_double_slash = int('//' in parsed.path)
    
    # Feature 14: Has dash in domain
    has_dash_in_domain = int('-' in domain)
    
    # Feature 15: Is URL shortener
    is_url_shortener = int(any(s in domain for s in URL_SHORTENERS))
    
    # Feature 16: Has suspicious words
    has_suspicious_words = int(any(w in full_url for w in SUSPICIOUS_WORDS))
    
    # Feature 17: Number of digits in URL
    num_digits = sum(c.isdigit() for c in url)
    
    # Feature 18: Special character count (excluding common URL chars)
    special_chars = re.findall(r'[^a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;=%]', url)
    special_char_count = len(special_chars)
    
    # Feature 19: Query string length
    query_length = len(parsed.query)
    
    # Feature 20: Path length
    path_length = len(path)
    
    # Feature 21: Has hex encoding
    has_hex = int('%' in url)
    
    # Feature 22: Domain token count (words in domain)
    domain_tokens = len(re.findall(r'[a-z]+', domain))
    
    # Feature 23: Digit ratio in domain
    digit_ratio_domain = sum(c.isdigit() for c in domain) / (len(domain) + 1)
    
    # Feature 24: Path token count
    path_tokens = len([p for p in path.split('/') if p])
    
    features = [
        url_length, num_dots, num_hyphens, num_underscores, num_slashes,
        num_question_marks, num_equals, has_at_symbol, has_ip_address,
        has_https, domain_length, num_subdomains, has_double_slash,
        has_dash_in_domain, is_url_shortener, has_suspicious_words,
        num_digits, special_char_count, query_length, path_length,
        has_hex, domain_tokens, digit_ratio_domain, path_tokens
    ]
    
    feature_dict = {
        'url_length': url_length,
        'num_dots': num_dots,
        'num_hyphens': num_hyphens,
        'num_underscores': num_underscores,
        'num_slashes': num_slashes,
        'num_question_marks': num_question_marks,
        'num_equals': num_equals,
        'has_at_symbol': bool(has_at_symbol),
        'has_ip_address': bool(has_ip_address),
        'has_https': bool(has_https),
        'domain_length': domain_length,
        'num_subdomains': num_subdomains,
        'has_double_slash': bool(has_double_slash),
        'has_dash_in_domain': bool(has_dash_in_domain),
        'is_url_shortener': bool(is_url_shortener),
        'has_suspicious_words': bool(has_suspicious_words),
        'num_digits': num_digits,
        'special_char_count': special_char_count,
        'query_length': query_length,
        'path_length': path_length,
        'has_hex': bool(has_hex),
        'domain_tokens': domain_tokens,
        'digit_ratio_domain': round(digit_ratio_domain, 4),
        'path_tokens': path_tokens
    }
    
    return features, feature_dict
