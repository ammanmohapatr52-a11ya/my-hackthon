"""
Neurobridge Real Email Dispatch Service
Provides direct SMTP email transmission to Gmail and other mail providers.
Supports HTML Stark Arc Reactor themed templates, TLS/SSL, and credential configuration.
"""

import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv, set_key
from backend.app.core.smtp_credentials import SMTP_ACTIVE_CONFIG, BREVO_ACTIVE_CONFIG

class EmailService:
    def __init__(self):
        self.reload_config()

    @staticmethod
    def _find_env_file() -> Path:
        backend_dir = Path(__file__).resolve().parent.parent.parent.parent
        backend_env = backend_dir / ".env"
        if backend_env.exists():
            return backend_env
        root_env = backend_dir.parent / ".env"
        if root_env.exists():
            return root_env
        return backend_env

    def reload_config(self):
        env_path = self._find_env_file()
        if env_path.exists():
            load_dotenv(dotenv_path=env_path, override=True)
        else:
            load_dotenv(override=True)
            
        # Brevo (Sendinblue) Transactional API Configuration
        self.brevo_api_key: str = (os.getenv("BREVO_API_KEY") or BREVO_ACTIVE_CONFIG["api_key"]).strip()
        self.brevo_sender_email: str = (os.getenv("BREVO_SENDER_EMAIL") or BREVO_ACTIVE_CONFIG["sender_email"]).strip()
        self.brevo_sender_name: str = (os.getenv("BREVO_SENDER_NAME") or BREVO_ACTIVE_CONFIG["sender_name"]).strip()
        self.brevo_api_url: str = BREVO_ACTIVE_CONFIG.get("api_url", "https://api.brevo.com/v3/smtp/email")

        # Fallback SMTP Relay Configuration
        self.host: str = (os.getenv("SMTP_HOST") or SMTP_ACTIVE_CONFIG["host"]).strip()
        self.port: int = int(os.getenv("SMTP_PORT") or SMTP_ACTIVE_CONFIG["port"])
        self.user: str = (os.getenv("SMTP_USER") or SMTP_ACTIVE_CONFIG["user"]).strip()
        raw_pass = os.getenv("SMTP_PASSWORD") or SMTP_ACTIVE_CONFIG["password"]
        self.password: str = str(raw_pass).strip().replace(" ", "").replace('"', '').replace("'", "")
        self.from_name: str = (os.getenv("SMTP_FROM_NAME") or SMTP_ACTIVE_CONFIG["from_name"]).strip()
        self.from_email: str = (os.getenv("SMTP_FROM_EMAIL") or self.user).strip() or self.user

    def is_configured(self) -> bool:
        return bool(self.brevo_api_key or (self.user and self.password))

    def get_public_config(self) -> Dict[str, Any]:
        has_brevo = bool(self.brevo_api_key)
        return {
            "configured": self.is_configured(),
            "host": "api.brevo.com" if has_brevo else self.host,
            "port": 443 if has_brevo else self.port,
            "user": self.brevo_sender_email if has_brevo else (self.user if self.user else "(Not configured)"),
            "from_name": self.brevo_sender_name if has_brevo else self.from_name,
            "masked_password": f"{self.brevo_api_key[:10]}••••{self.brevo_api_key[-6:]}" if has_brevo else ("••••••••••••" if self.password else "(Not configured)"),
            "provider": "Brevo Transactional API (Active)" if has_brevo else ("Gmail SMTP" if "gmail" in self.host.lower() else "Custom SMTP"),
            "brevo_active": has_brevo,
        }

    def update_config(
        self,
        user: str,
        password: str,
        host: Optional[str] = None,
        port: Optional[int] = None,
        from_name: Optional[str] = None
    ) -> Dict[str, Any]:
        env_path = self._find_env_file()
        
        clean_user = user.strip()
        clean_pass = password.strip().replace(" ", "").replace('"', '').replace("'", "")
        clean_host = (host or "smtp.gmail.com").strip()
        clean_port = str(port or 587).strip()
        clean_name = (from_name or "Neurobridge Stark Academy").strip()

        if env_path.exists():
            set_key(str(env_path), "SMTP_HOST", clean_host)
            set_key(str(env_path), "SMTP_PORT", clean_port)
            set_key(str(env_path), "SMTP_USER", clean_user)
            set_key(str(env_path), "SMTP_PASSWORD", clean_pass)
            set_key(str(env_path), "SMTP_FROM_NAME", clean_name)
        else:
            with open(env_path, "a", encoding="utf-8") as f:
                f.write(f"\nSMTP_HOST={clean_host}\n")
                f.write(f"SMTP_PORT={clean_port}\n")
                f.write(f"SMTP_USER={clean_user}\n")
                f.write(f"SMTP_PASSWORD={clean_pass}\n")
                f.write(f"SMTP_FROM_NAME={clean_name}\n")

        os.environ["SMTP_HOST"] = clean_host
        os.environ["SMTP_PORT"] = clean_port
        os.environ["SMTP_USER"] = clean_user
        os.environ["SMTP_PASSWORD"] = clean_pass
        os.environ["SMTP_FROM_NAME"] = clean_name

        self.reload_config()
        return self.get_public_config()

    def generate_otp_html(self, username: str, otp: str, expires_minutes: int = 10, to_email: str = "") -> str:
        # Create 6 individual table cells for the digits so mobile clients NEVER wrap them
        digit_cells = "".join([
            f'<td align="center" style="padding: 0 10px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Consolas, Monaco, monospace; font-size: 40px; font-weight: 800; color: #38bdf8; line-height: 1; text-shadow: 0 0 20px rgba(56, 189, 248, 0.45); white-space: nowrap;">{d}</td>'
            for d in list(otp)
        ])
        
        display_email = to_email.strip() if to_email else (username if "@" in username else "your account")

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070a12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #070a12; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #0c1220; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7); overflow: hidden;">
          
          <!-- Top Header Banner with Purple/Indigo Gradient -->
          <tr>
            <td style="background: linear-gradient(180deg, #1e1b4b 0%, #0c1220 100%); padding: 36px 20px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              
              <!-- ATLAS 2.0 CORE AUTH Pill Badge -->
              <div style="display: inline-block; padding: 4px 16px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.45); border-radius: 9999px; color: #a5b4fc; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">
                ATLAS 2.0 CORE AUTH
              </div>

              <!-- Main Title -->
              <h1 style="margin: 14px 0 4px 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.01em;">
                Security Verification
              </h1>
              
              <!-- Subtitle -->
              <p style="margin: 0; color: #94a3b8; font-size: 14px; font-weight: 500;">
                Account Login Verification
              </p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 24px 32px; text-align: left;">
              
              <!-- Greeting & Email Association -->
              <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 15px; font-weight: 500;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                A secure login request was initiated for your ATLAS 2.0 account associated with <span style="color: #38bdf8; font-weight: 600;">{display_email}</span>.
              </p>

              <!-- One-Time Verification Code Box (Single Horizontal Row) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; margin: 0 0 24px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);">
                <tr>
                  <td align="center" style="padding: 24px 16px 20px;">
                    
                    <div style="font-size: 11px; color: #64748b; letter-spacing: 0.15em; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
                      ONE-TIME VERIFICATION CODE
                    </div>

                    <!-- 6 Digits Table: Strictly Non-Wrapping Horizontal Cells -->
                    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto; border-collapse: collapse; white-space: nowrap !important;">
                      <tr style="white-space: nowrap !important;">
                        {digit_cells}
                      </tr>
                    </table>

                    <!-- Expiry Badge -->
                    <div style="font-size: 12px; color: #94a3b8;">
                      This code expires in <span style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 9999px; padding: 2px 10px; color: #fca5a5; font-size: 11px; font-weight: 700; margin-left: 4px;">{expires_minutes} minutes</span>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Instruction Paragraph -->
              <p style="margin: 0 0 22px 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                Enter this 6-digit code on the ATLAS 2.0 login screen to verify your identity and gain immediate access to your workspace.
              </p>

              <!-- Security Notice Callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827; border-left: 3px solid #6366f1; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 14px; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                    <strong style="color: #e2e8f0;">Security Notice:</strong> Never share this code with anyone. ATLAS staff will never ask for your one-time verification code. If you did not request this, please change your credentials immediately.
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #475569; font-size: 11px; text-align: center;">
                Protected by <strong>ATLAS Core Authentication Shield</strong> · Automated Security Transmission
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080c16; padding: 16px 20px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #475569;">
              ATLAS 2.0 Academic System · All Rights Reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    def send_via_brevo(self, to_email: str, username: str, otp: str, expires_minutes: int = 10, is_demo: bool = False) -> Dict[str, Any]:
        """
        Dispatches OTP email directly via Brevo (Sendinblue) Transactional REST API.
        Uses https://api.brevo.com/v3/smtp/email with api-key header.
        """
        clean_to = to_email.strip().lower()
        if not self.brevo_api_key:
            return {"success": False, "error": "Brevo API key not configured"}

        if is_demo or expires_minutes <= 1:
            subject = f"One-Time Demo Access Code: {otp} (Valid for 1 Minute)"
            html_content = self.generate_otp_html(username, otp, expires_minutes=1, to_email=clean_to)
            text_content = (
                f"Hello Demo Student,\n\n"
                f"A one-time demo access request was initiated for your Neurobridge workspace associated with {clean_to}.\n\n"
                f"ONE-TIME DEMO PASSCODE (NO PASSWORD REQUIRED):\n"
                f"{otp}\n\n"
                f"CRITICAL: This code is strictly valid for 1 MINUTE (60 SECONDS).\n"
                f"Each Gmail address can only be used for the demo once.\n\n"
                f"Enter this 6-digit code on the demo screen to start your session.\n"
            )
        else:
            subject = f"Security Verification: {otp} (Neurobridge Login Code)"
            html_content = self.generate_otp_html(username, otp, expires_minutes=expires_minutes, to_email=clean_to)
            text_content = (
                f"Hello,\n\n"
                f"A secure login request was initiated for your Neurobridge account associated with {clean_to}.\n\n"
                f"ONE-TIME VERIFICATION CODE:\n"
                f"{otp}\n\n"
                f"This code expires in {expires_minutes} minutes.\n"
                f"Enter this 6-digit code on the login screen to verify your identity.\n\n"
                f"Security Notice: Never share this code with anyone.\n"
            )

        payload = {
            "sender": {
                "name": self.brevo_sender_name or "NEUROBRIDGE Stark Academy",
                "email": self.brevo_sender_email or "neurobridge123@gmail.com"
            },
            "to": [
                {
                    "email": clean_to,
                    "name": username or clean_to.split("@")[0]
                }
            ],
            "subject": subject,
            "htmlContent": html_content,
            "textContent": text_content
        }

        try:
            import urllib.request
            import json

            data_bytes = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                self.brevo_api_url,
                data=data_bytes,
                headers={
                    "api-key": self.brevo_api_key,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=12) as response:
                resp_text = response.read().decode("utf-8")
                res_json = json.loads(resp_text) if resp_text else {}
                message_id = res_json.get("messageId", "")
                print(f"\n[NEUROBRIDGE BREVO API DISPATCH] Email successfully sent to {clean_to} (MessageId: {message_id})")
                return {
                    "success": True,
                    "delivered_via": "live_brevo_api",
                    "recipient": clean_to,
                    "messageId": message_id,
                    "provider": "Brevo API",
                    "message": f"Verification code successfully dispatched directly to {clean_to} via Brevo Mailer"
                }
        except Exception as e:
            print(f"\n[NEUROBRIDGE BREVO ERROR] API dispatch failed: {e}")
            return {
                "success": False,
                "error": f"Brevo API error: {str(e)}",
                "details": str(e)
            }

    def _send_via_smtp(self, to_email: str, username: str, otp: str, expires_minutes: int = 10, is_demo: bool = False) -> Dict[str, Any]:
        """Fallback direct SMTP email dispatch via Gmail/other mail providers."""
        clean_to = to_email.strip().lower()
        if not (self.user and self.password):
            return {
                "success": False,
                "needs_config": True,
                "error": "SMTP is not configured with user/password.",
                "otp_preview": otp
            }

        if is_demo or expires_minutes <= 1:
            subject = f"One-Time Demo Access Code: {otp} (Valid for 1 Minute)"
            html_content = self.generate_otp_html(username, otp, expires_minutes=1, to_email=clean_to)
            text_content = f"Your Neurobridge demo code: {otp} (valid for 1 minute)."
        else:
            subject = f"Security Verification: {otp} (Neurobridge Login Code)"
            html_content = self.generate_otp_html(username, otp, expires_minutes=expires_minutes, to_email=clean_to)
            text_content = f"Your Neurobridge verification code: {otp} (expires in {expires_minutes} minutes)."

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{self.from_name} <{self.user}>"
        msg["To"] = clean_to
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        try:
            context = ssl.create_default_context()
            if self.port == 465:
                with smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=12) as server:
                    server.login(self.user, self.password)
                    server.sendmail(self.user, [clean_to], msg.as_string())
            else:
                with smtplib.SMTP(self.host, self.port, timeout=12) as server:
                    server.ehlo()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(self.user, self.password)
                    server.sendmail(self.user, [clean_to], msg.as_string())

            print(f"\n[NEUROBRIDGE SMTP DISPATCH] Live Email successfully sent to {clean_to} via {self.host}:{self.port}!")
            return {
                "success": True,
                "delivered_via": "live_gmail_smtp",
                "recipient": clean_to,
                "host": self.host,
                "message": f"Verification code successfully dispatched directly to {clean_to}"
            }
        except Exception as e:
            print(f"\n[NEUROBRIDGE SMTP ERROR] SMTP dispatch failed: {e}")
            return {
                "success": False,
                "error": f"Failed to connect to SMTP server ({self.host}:{self.port}): {str(e)}",
                "details": str(e),
                "otp_preview": otp
            }

    def send_otp_email(self, to_email: str, username: str, otp: str, expires_minutes: int = 10, is_demo: bool = False) -> Dict[str, Any]:
        """
        Sends OTP email via Brevo REST API (Primary) with fallback to Gmail SMTP.
        """
        self.reload_config()
        clean_to = to_email.strip().lower()
        if not clean_to or "@" not in clean_to:
            return {"success": False, "error": "Invalid recipient email address"}

        # 1. Primary Dispatch Channel: Brevo REST API
        if self.brevo_api_key:
            brevo_res = self.send_via_brevo(clean_to, username, otp, expires_minutes=expires_minutes, is_demo=is_demo)
            if brevo_res.get("success"):
                return brevo_res
            print(f"[NEUROBRIDGE DISPATCH] Brevo API encountered an issue ({brevo_res.get('error')}), falling back to SMTP...")

        # 2. Secondary Fallback Channel: Direct SMTP
        return self._send_via_smtp(clean_to, username, otp, expires_minutes=expires_minutes, is_demo=is_demo)

    def test_connection(self, to_email: Optional[str] = None) -> Dict[str, Any]:
        """
        Tests email dispatch capability via Brevo API or SMTP.
        """
        self.reload_config()
        if self.brevo_api_key:
            try:
                import urllib.request
                import json

                if to_email and "@" in to_email:
                    payload = {
                        "sender": {
                            "name": self.brevo_sender_name or "NEUROBRIDGE Stark Academy",
                            "email": self.brevo_sender_email or "neurobridge123@gmail.com"
                        },
                        "to": [{"email": to_email.strip().lower(), "name": "Admin Tester"}],
                        "subject": "⚡ Neurobridge Live Dispatch Test: Brevo API Connected!",
                        "htmlContent": "<h3>Neurobridge Brevo API Connected!</h3><p>Live OTP verification codes are now transmitting directly to recipient inboxes.</p>"
                    }
                    data_bytes = json.dumps(payload).encode("utf-8")
                    req = urllib.request.Request(
                        self.brevo_api_url,
                        data=data_bytes,
                        headers={
                            "api-key": self.brevo_api_key,
                            "Content-Type": "application/json"
                        },
                        method="POST"
                    )
                    with urllib.request.urlopen(req, timeout=10) as res:
                        return {
                            "success": True,
                            "message": f"Brevo API Connected! Live test email dispatched to {to_email}.",
                            "sender": self.brevo_sender_email,
                            "provider": "Brevo API"
                        }
                else:
                    req = urllib.request.Request(
                        "https://api.brevo.com/v3/account",
                        headers={"api-key": self.brevo_api_key}
                    )
                    with urllib.request.urlopen(req, timeout=10) as res:
                        account_data = json.loads(res.read().decode("utf-8"))
                        return {
                            "success": True,
                            "message": f"Brevo API Connected successfully for {account_data.get('email')} ({account_data.get('companyName')})!",
                            "sender": account_data.get("email"),
                            "provider": "Brevo API"
                        }
            except Exception as e:
                print(f"[NEUROBRIDGE TEST] Brevo test encountered: {e}, testing SMTP...")

        # Fallback to testing SMTP
        return self._test_smtp_connection(to_email=to_email)

    def _test_smtp_connection(self, to_email: Optional[str] = None) -> Dict[str, Any]:
        """Tests SMTP connection directly."""
        if not (self.user and self.password):
            return {
                "success": False,
                "error": "Email dispatcher is not configured. Please supply Brevo API key or Gmail SMTP credentials.",
            }

        try:
            context = ssl.create_default_context()
            if self.port == 465:
                server = smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=12)
            else:
                server = smtplib.SMTP(self.host, self.port, timeout=12)
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()

            server.login(self.user, self.password)
            if to_email and "@" in to_email:
                clean_to = to_email.strip().lower()
                msg = MIMEMultipart("alternative")
                msg["Subject"] = "⚡ Neurobridge Live Dispatch Test: Connection Successful!"
                msg["From"] = f"{self.from_name} <{self.user}>"
                msg["To"] = clean_to
                msg.attach(MIMEText("Your Neurobridge Gmail SMTP Gateway is verified and active!\n", "plain", "utf-8"))
                server.sendmail(self.user, [clean_to], msg.as_string())
            server.quit()
            return {
                "success": True,
                "message": f"SMTP authentication successful via {self.host}:{self.port} as {self.user}!" + (f" Test email sent to {to_email}." if to_email else ""),
                "sender": self.user,
                "host": self.host,
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to connect to SMTP server ({self.host}:{self.port}): {str(e)}",
                "details": str(e)
            }

email_service = EmailService()
