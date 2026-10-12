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
            
        self.host: str = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
        self.port: int = int(os.getenv("SMTP_PORT", "587").strip() or 587)
        self.user: str = os.getenv("SMTP_USER", "").strip()
        raw_pass = os.getenv("SMTP_PASSWORD", "")
        self.password: str = raw_pass.strip().replace(" ", "").replace('"', '').replace("'", "")
        self.from_name: str = os.getenv("SMTP_FROM_NAME", "Neurobridge Stark Academy").strip()
        self.from_email: str = os.getenv("SMTP_FROM_EMAIL", self.user).strip() or self.user

    def is_configured(self) -> bool:
        return bool(self.user and self.password)

    def get_public_config(self) -> Dict[str, Any]:
        return {
            "configured": self.is_configured(),
            "host": self.host,
            "port": self.port,
            "user": self.user if self.user else "(Not configured)",
            "from_name": self.from_name,
            "masked_password": "••••••••••••" if self.password else "(Not configured)",
            "provider": "Gmail SMTP" if "gmail" in self.host.lower() else "Custom SMTP",
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

    def send_otp_email(self, to_email: str, username: str, otp: str) -> Dict[str, Any]:
        """
        Sends OTP email via SMTP (e.g. Gmail).
        Returns status dictionary indicating whether it was sent via live SMTP or needs setup.
        """
        clean_to = to_email.strip().lower()
        if not clean_to or "@" not in clean_to:
            return {"success": False, "error": "Invalid recipient email address"}

        # If SMTP is not yet configured with user/pass
        if not self.is_configured():
            return {
                "success": False,
                "needs_config": True,
                "error": "Gmail SMTP is not configured. Please provide your Gmail address and Google App Password.",
                "hint": "Create a Google App Password at https://myaccount.google.com/apppasswords and save it in settings.",
                "otp_preview": otp
            }

        # Pre-validate Gmail App Password format
        if "gmail" in self.host.lower():
            clean_pass = self.password.strip().replace(" ", "")
            if len(clean_pass) != 16 or not clean_pass.isalpha():
                err_msg = (
                    "Google rejects personal account passwords on SMTP. "
                    "You must use a 16-character Google App Password (e.g. 'abcd efgh ijkl mnop') "
                    "generated from https://myaccount.google.com/apppasswords"
                )
                print(f"\n[NEUROBRIDGE SMTP REJECTED] {err_msg} (Provided password length: {len(clean_pass)})")
                return {
                    "success": False,
                    "error": err_msg,
                    "details": "Invalid password format for Gmail SMTP. Expected 16-letter App Password.",
                    "hint": "1. Turn on 2-Step Verification: https://myaccount.google.com/security\n2. Generate a 16-letter App Password: https://myaccount.google.com/apppasswords",
                    "otp_preview": otp
                }

        # Build MIME Message
        subject = f"Security Verification: {otp} (ATLAS 2.0 Login Code)"
        html_content = self.generate_otp_html(username, otp, expires_minutes=10, to_email=clean_to)
        text_content = (
            f"Hello,\n\n"
            f"A secure login request was initiated for your ATLAS 2.0 account associated with {clean_to}.\n\n"
            f"ONE-TIME VERIFICATION CODE:\n"
            f"{otp}\n\n"
            f"This code expires in 10 minutes.\n"
            f"Enter this 6-digit code on the login screen to verify your identity.\n\n"
            f"Security Notice: Never share this code with anyone.\n"
        )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{self.from_name} <{self.user}>"
        msg["To"] = clean_to

        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        try:
            context = ssl.create_default_context()
            
            if self.port == 465:
                # SSL Direct
                with smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=12) as server:
                    server.login(self.user, self.password)
                    server.sendmail(self.user, [clean_to], msg.as_string())
            else:
                # STARTTLS (Port 587 default for Gmail)
                with smtplib.SMTP(self.host, self.port, timeout=12) as server:
                    server.ehlo()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(self.user, self.password)
                    server.sendmail(self.user, [clean_to], msg.as_string())

            print(f"\n[NEUROBRIDGE SMTP DISPATCH] Live Email successfully sent to {clean_to} via {self.host}:{self.port}!")
            return {
                "success": True,
                "delivered_via": "live_smtp",
                "recipient": clean_to,
                "host": self.host,
                "message": f"Verification code successfully dispatched directly to {clean_to}"
            }

        except (smtplib.SMTPAuthenticationError, smtplib.SMTPServerDisconnected) as e:
            err_msg = (
                "Gmail SMTP authentication failed. Google strictly prohibits standard personal account passwords. "
                "You MUST use a 16-character 'Google App Password' generated at: https://myaccount.google.com/apppasswords"
            )
            print(f"\n[NEUROBRIDGE SMTP ERROR] {err_msg} Details: {e}")
            return {
                "success": False,
                "error": err_msg,
                "details": str(e),
                "hint": "1. Turn on 2-Step Verification at https://myaccount.google.com/security\n2. Create an App Password at https://myaccount.google.com/apppasswords",
                "otp_preview": otp
            }
        except Exception as e:
            print(f"\n[NEUROBRIDGE SMTP ERROR] Connection failed: {e}")
            return {
                "success": False,
                "error": f"Failed to connect to SMTP server ({self.host}:{self.port}): {str(e)}",
                "details": str(e),
                "otp_preview": otp
            }

    def test_connection(self, to_email: Optional[str] = None) -> Dict[str, Any]:
        """
        Tests the SMTP server handshake & login, and optionally transmits a verification test ping.
        """
        if not self.is_configured():
            return {
                "success": False,
                "error": "Gmail SMTP is not configured. Please supply your Gmail address and 16-character Google App Password.",
                "hint": "Generate a Google App Password at: https://myaccount.google.com/apppasswords"
            }

        # Pre-validate Gmail App Password format
        if "gmail" in self.host.lower():
            clean_pass = self.password.strip().replace(" ", "")
            if len(clean_pass) != 16 or not clean_pass.isalpha():
                return {
                    "success": False,
                    "error": (
                        f"Detected regular Gmail password ('{self.password[:3]}...'). "
                        "Google strictly prohibits standard account passwords on SMTP. "
                        "You must use a 16-character Google App Password (e.g. 'abcd efgh ijkl mnop')."
                    ),
                    "hint": "1. Turn on 2-Step Verification: https://myaccount.google.com/security\n2. Create 16-letter App Password: https://myaccount.google.com/apppasswords\n3. Paste the 16 letters into the password field."
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

                body = (
                    f"Hello!\n\n"
                    f"Your Neurobridge Gmail SMTP Gateway is verified and active!\n"
                    f"Sender: {self.user}\n"
                    f"Recipient: {clean_to}\n"
                    f"Host: {self.host}:{self.port}\n\n"
                    f"All OTP verification codes will now be dispatched directly to your Gmail inbox.\n"
                )
                msg.attach(MIMEText(body, "plain", "utf-8"))
                server.sendmail(self.user, [clean_to], msg.as_string())

            server.quit()
            return {
                "success": True,
                "message": f"SMTP authentication successful via {self.host}:{self.port} as {self.user}!" + (f" Test email sent to {to_email}." if to_email else ""),
                "sender": self.user,
                "host": self.host,
            }
        except (smtplib.SMTPAuthenticationError, smtplib.SMTPServerDisconnected) as e:
            return {
                "success": False,
                "error": "Gmail SMTP Authentication Failed. Google strictly prohibits standard personal account passwords.",
                "details": str(e),
                "hint": "1. Turn on 2-Step Verification at https://myaccount.google.com/security\n2. Create a 16-character App Password at https://myaccount.google.com/apppasswords\n3. Paste that 16-letter code into the setup modal."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to connect to SMTP server ({self.host}:{self.port}): {str(e)}",
                "details": str(e)
            }

email_service = EmailService()
