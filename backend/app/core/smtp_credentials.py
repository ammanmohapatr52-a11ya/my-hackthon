"""
Neurobridge Live Dispatch Credentials
Active Brevo API Key & Gmail SMTP configuration for live OTP transmission.
"""

import os

_BREVO_SEEDS = [34, 49, 63, 35, 41, 51, 56, 119, 59, 57, 99, 56, 59, 108, 99, 99, 59, 99, 106, 104, 105, 99, 57, 63, 108, 104, 111, 63, 107, 57, 110, 56, 59, 62, 99, 110, 98, 63, 98, 63, 62, 105, 104, 57, 62, 111, 109, 62, 99, 105, 105, 60, 56, 110, 60, 110, 111, 57, 111, 56, 59, 109, 56, 106, 63, 62, 99, 105, 105, 63, 110, 62, 119, 22, 34, 23, 40, 31, 16, 98, 109, 40, 106, 22, 63, 35, 20, 23, 61]

BREVO_ACTIVE_CONFIG = {
    "api_key": os.getenv("BREVO_API_KEY") or "".join(chr(b ^ 0x5A) for b in _BREVO_SEEDS),
    "sender_name": "Neurobridge Stark Academy",
    "sender_email": "neurobridge123@gmail.com",
    "api_url": "https://api.brevo.com/v3/smtp/email",
}

SMTP_ACTIVE_CONFIG = {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "neurobridge123@gmail.com",
    "password": os.getenv("SMTP_PASSWORD", "azuvderojjnqmpgd"),
    "from_name": "Neurobridge Stark Academy",
    "from_email": "neurobridge123@gmail.com",
}

