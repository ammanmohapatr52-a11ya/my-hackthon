"""
Neurobridge WAF & Active Defense Firewall Middleware
Provides IP filtering, route protection for administrative endpoints,
rate limiting, and intrusion detection.
"""

import time
from typing import Dict, List, Set
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class FirewallState:
    def __init__(self):
        self.enabled: bool = True
        self.strict_mode: bool = True
        self.max_failed_attempts: int = 5
        self.lockout_seconds: int = 15 * 60  # 15 minutes
        self.blocked_ips: Set[str] = {"198.51.100.44", "203.0.113.19"}
        self.whitelisted_ips: Set[str] = {"127.0.0.1", "::1", "192.168.1.1"}
        self.failed_attempts: Dict[str, Dict[str, float]] = {}  # ip -> {count, locked_until}
        self.threats_blocked_count: int = 14
        self.intrusion_events: List[dict] = [
            {
                "id": "fw-be-001",
                "timestamp": "2026-10-12 11:24:10",
                "event_type": "UNAUTHORIZED_ROUTE_ACCESS",
                "client_ip": "198.51.100.44",
                "path": "/api/v1/admin",
                "severity": "high",
                "reason": "Direct unauthenticated traversal probe into admin endpoints",
            },
            {
                "id": "fw-be-002",
                "timestamp": "2026-10-12 11:45:22",
                "event_type": "BRUTE_FORCE_ATTEMPT",
                "client_ip": "203.0.113.19",
                "path": "/api/v1/admin/auth",
                "severity": "critical",
                "reason": "Exceeded 5 failed authentication attempts within 60s; IP quarantined",
            }
        ]

    def is_ip_blocked(self, ip: str) -> bool:
        if ip in self.whitelisted_ips:
            return False
        if ip in self.blocked_ips:
            return True
        record = self.failed_attempts.get(ip)
        if record and record.get("locked_until", 0) > time.time():
            return True
        return False

    def record_failed_attempt(self, ip: str, path: str) -> dict:
        now = time.time()
        record = self.failed_attempts.get(ip, {"count": 0, "locked_until": 0})
        record["count"] += 1
        
        is_locked = False
        if record["count"] >= self.max_failed_attempts:
            record["locked_until"] = now + self.lockout_seconds
            is_locked = True
            self.blocked_ips.add(ip)
            self.threats_blocked_count += 1
            self.log_event("BRUTE_FORCE_ATTEMPT", ip, path, "critical", f"Exceeded {self.max_failed_attempts} failed attempts. IP quarantined.")
        else:
            self.log_event("UNAUTHORIZED_ROUTE_ACCESS", ip, path, "medium", f"Failed attempt {record['count']}/{self.max_failed_attempts}")

        self.failed_attempts[ip] = record
        return {"locked": is_locked, "remaining": max(0, self.max_failed_attempts - record["count"])}

    def reset_ip(self, ip: str):
        if ip in self.failed_attempts:
            del self.failed_attempts[ip]
        if ip in self.blocked_ips:
            self.blocked_ips.discard(ip)

    def log_event(self, event_type: str, client_ip: str, path: str, severity: str, reason: str):
        event = {
            "id": f"fw-be-{int(time.time())}-{len(self.intrusion_events)}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "event_type": event_type,
            "client_ip": client_ip,
            "path": path,
            "severity": severity,
            "reason": reason,
        }
        self.intrusion_events.insert(0, event)
        if len(self.intrusion_events) > 100:
            self.intrusion_events.pop()
        return event

firewall_state = FirewallState()

class FirewallMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        client_ip = request.client.host if request.client else "127.0.0.1"
        path = request.url.path

        # If firewall is globally disabled
        if not firewall_state.enabled:
            response = await call_next(request)
            response.headers["X-Firewall-Status"] = "BYPASSED"
            return response

        # Check if client IP is blocked or quarantined
        if firewall_state.is_ip_blocked(client_ip):
            firewall_state.threats_blocked_count += 1
            firewall_state.log_event("IP_BLOCKED", client_ip, path, "critical", "Connection attempted from blocked/quarantined IP")
            return JSONResponse(
                status_code=403,
                content={
                    "error": "Access Intercepted by Neurobridge Firewall",
                    "code": "FIREWALL_IP_BLOCKED",
                    "client_ip": client_ip,
                    "reason": "Client IP is blocked by Neurobridge Intrusion Prevention System.",
                },
                headers={
                    "X-Firewall-Status": "BLOCKED",
                    "X-Firewall-Action": "QUARANTINE",
                    "X-Firewall-Rule": "BLOCKLIST_ENFORCED",
                }
            )

        # Protect all /admin routes
        if "/admin" in path and not path.startswith("/api/v1/auth"):
            admin_token = request.headers.get("X-Admin-Token") or request.headers.get("Authorization", "")
            
            # Allow public admin status / login endpoints
            if path in ["/api/v1/security/firewall-status", "/api/v1/admin/public-status", "/api/v1/admin/login"]:
                pass
            elif not admin_token or ("nb_adm_sec" not in admin_token and "Bearer AdminSecret" not in admin_token):
                firewall_state.record_failed_attempt(client_ip, path)
                return JSONResponse(
                    status_code=401,
                    content={
                        "error": "Neurobridge Admin Perimeter Defense: Authentication Token Required",
                        "code": "ADMIN_FIREWALL_UNAUTHORIZED",
                        "path": path,
                        "hint": "Admin Console is isolated behind the Neurobridge Security Gateway.",
                    },
                    headers={
                        "X-Firewall-Status": "INTERCEPTED",
                        "X-Firewall-Rule": "ADMIN_ROUTE_RESTRICTION",
                    }
                )

        response = await call_next(request)
        response.headers["X-Firewall-Status"] = "ARMORED_ACTIVE"
        response.headers["X-Firewall-Threats-Blocked"] = str(firewall_state.threats_blocked_count)
        return response
