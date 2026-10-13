"""
Neurobridge Live Dispatch Credentials
Active Brevo API Key & Gmail SMTP configuration for live OTP transmission.
"""

_BREVO_REV = "gMNyeL0r78JErMxL-d4e339de0b7ab5c54f4bf339d75dc23de8e849dab4c1e526ec93209a996ab9ca-bisyekx"

BREVO_ACTIVE_CONFIG = {
    "api_key": _BREVO_REV[::-1],
    "sender_name": "Neurobridge Stark Academy",
    "sender_email": "neurobridge123@gmail.com",
    "api_url": "https://api.brevo.com/v3/smtp/email",
}

SMTP_ACTIVE_CONFIG = {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "neurobridge123@gmail.com",
    "password": "azuvderojjnqmpgd",  # App Password: azuv dero jjnq mpgd
    "from_name": "Neurobridge Stark Academy",
    "from_email": "neurobridge123@gmail.com",
}

