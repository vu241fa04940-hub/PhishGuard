const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd',
  'buff.ly', 'adf.ly', 'tiny.cc', 'rebrand.ly', 'cutt.ly', 'short.io'
];

const SUSPICIOUS_WORDS = [
  'login', 'signin', 'account', 'secure', 'verify', 'update', 'confirm',
  'banking', 'paypal', 'ebay', 'amazon', 'microsoft', 'apple', 'google',
  'password', 'credential', 'free', 'winner', 'prize', 'click', 'urgent',
  'suspended', 'limited', 'restore', 'validate', 'webscr', 'cmd'
];

export function analyzeUrlClientSide(rawUrl) {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    parsed = {
      hostname: url.split('/')[0] || '',
      pathname: '',
      search: '',
      protocol: 'http:'
    };
  }

  const domain = (parsed.hostname || '').toLowerCase();
  const path = (parsed.pathname || '').toLowerCase();
  const fullUrl = url.toLowerCase();

  // Feature extraction
  const url_length = url.length;
  const num_dots = (url.match(/\./g) || []).length;
  const num_hyphens = (url.match(/-/g) || []).length;
  const num_underscores = (url.match(/_/g) || []).length;
  const num_slashes = (url.match(/\//g) || []).length;
  const num_question_marks = (url.match(/\?/g) || []).length;
  const num_equals = (url.match(/=/g) || []).length;
  const has_at_symbol = url.includes('@');

  const ipPattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  const has_ip_address = ipPattern.test(domain);
  const has_https = parsed.protocol === 'https:';
  const domain_length = domain.length;

  const domainParts = domain.split('.').filter(Boolean);
  const num_subdomains = Math.max(0, domainParts.length - 2);

  const has_double_slash = path.includes('//');
  const has_dash_in_domain = domain.includes('-');
  const is_url_shortener = URL_SHORTENERS.some(s => domain.includes(s));
  const has_suspicious_words = SUSPICIOUS_WORDS.some(w => fullUrl.includes(w));

  const num_digits = (url.match(/\d/g) || []).length;
  const specialChars = url.match(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g) || [];
  const special_char_count = specialChars.length;

  // Heuristic Risk Score Computation
  let riskPoints = 0;
  const suspicious = [];

  if (has_ip_address) {
    riskPoints += 45;
    suspicious.push('Contains raw IP address instead of registered domain');
  }
  if (!has_https) {
    riskPoints += 15;
    suspicious.push('Lacks HTTPS transport security');
  }
  if (url_length > 75) {
    riskPoints += 15;
    suspicious.push(`Unusually long URL (${url_length} characters)`);
  }
  if (num_subdomains >= 3) {
    riskPoints += 25;
    suspicious.push(`Excessive subdomain levels (${num_subdomains} levels detected)`);
  } else if (num_subdomains === 2) {
    riskPoints += 10;
  }
  if (has_at_symbol) {
    riskPoints += 30;
    suspicious.push('Contains @ symbol used in redirect spoofing');
  }
  if (has_double_slash) {
    riskPoints += 25;
    suspicious.push('Contains double slash redirect signature in resource path');
  }
  if (has_dash_in_domain) {
    riskPoints += 15;
    suspicious.push('Domain contains hyphens characteristic of lookalike spoofing');
  }
  if (is_url_shortener) {
    riskPoints += 20;
    suspicious.push('Uses URL shortening service to mask true landing destination');
  }
  if (num_dots > 4) {
    riskPoints += 15;
    suspicious.push(`High dot frequency (${num_dots} dots)`);
  }
  if (has_suspicious_words) {
    riskPoints += 25;
    suspicious.push('Contains targeted credential keywords (e.g., login, verify, account, secure)');
  }
  if (special_char_count > 4) {
    riskPoints += 10;
    suspicious.push(`High special character density (${special_char_count} characters)`);
  }

  const riskScore = Math.min(100, Math.max(5, riskPoints));
  const isPhishing = riskScore >= 50;
  const confidence = isPhishing ? Math.min(0.98, 0.55 + (riskScore / 220)) : Math.min(0.98, 0.60 + ((100 - riskScore) / 220));

  return {
    success: true,
    url,
    prediction: isPhishing ? 'phishing' : 'legitimate',
    confidence: Number(confidence.toFixed(4)),
    riskScore,
    suspiciousFeatures: suspicious,
    features: {
      url_length,
      num_dots,
      num_hyphens,
      num_underscores,
      num_slashes,
      num_question_marks,
      num_equals,
      has_at_symbol,
      has_ip_address,
      has_https,
      domain_length,
      num_subdomains,
      has_double_slash,
      has_dash_in_domain,
      is_url_shortener,
      has_suspicious_words,
      num_digits,
      special_char_count
    }
  };
}

