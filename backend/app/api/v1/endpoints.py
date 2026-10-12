import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from fastapi.responses import StreamingResponse
from backend.app.core.config import settings
from backend.app.schemas.ai import (
    AskRequest,
    AskResponse,
    StatusResponse,
    DevelopQuestionRequest,
    DevelopQuestionResponse,
    ReResearchRequest,
    ReResearchResponse,
)
from backend.app.services.ai.ask_service import ask_service
from backend.app.services.ai.facts import fact_retriever
from backend.app.services.pdf.scanner import pdf_scanner_service

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "prompt_version": settings.PROMPT_VERSION
    }

@router.get("/ai/status", response_model=StatusResponse)
async def ai_status():
    ollama_health = await ask_service.ollama_provider.check_health()
    openrouter_health = await ask_service.openrouter_provider.check_health()

    models = []
    if ollama_health.get("reachable"):
        models.extend([f"ollama:{m}" for m in ollama_health.get("models", [])])
    if openrouter_health.get("reachable"):
        models.extend([f"openrouter:{m}" for m in openrouter_health.get("models", [])])

    return StatusResponse(
        status="ok",
        default_provider=settings.DEFAULT_PROVIDER,
        openrouter_configured=bool(settings.OPENROUTER_API_KEY),
        ollama_reachable=ollama_health.get("reachable", False),
        installed_models=models,
        rag_facts_count=len(fact_retriever.facts),
        prompt_version=settings.PROMPT_VERSION
    )

@router.get("/facts")
async def get_facts():
    return {
        "count": len(fact_retriever.facts),
        "facts": [
            {
                "id": f.id,
                "category": f.category,
                "question": f.question_variants[0],
                "answer": f.answer,
                "source": f.source,
                "verified_on": f.verified_on
            }
            for f in fact_retriever.facts
        ]
    }

@router.post("/ask", response_model=AskResponse)
async def ask_question(req: AskRequest):
    try:
        response = await ask_service.answer_question(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "AI_INFERENCE_ERROR",
                "message": str(e),
                "hint": "Check that your AI provider or Ollama service is running."
            }
        )

@router.post("/ask/stream")
async def ask_question_stream(req: AskRequest):
    """Server-Sent Events (SSE) streaming endpoint."""
    async def event_generator():
        try:
            # Yield route classification first
            provider, default_model = ask_service.get_provider(req.provider)
            model_name = req.model or default_model
            router_res = await ask_service.router_service.classify(req.question, provider, model_name)
            
            yield f"event: route\ndata: {json.dumps({'route': router_res.route})}\n\n"

            # Run answer
            resp = await ask_service.answer_question(req)
            yield f"event: final\ndata: {resp.model_dump_json()}\n\n"
        except Exception as e:
            err_payload = json.dumps({
                "code": "AI_STREAM_ERROR",
                "message": str(e),
                "hint": "Error during response generation"
            })
            yield f"event: error\ndata: {err_payload}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/develop-question", response_model=DevelopQuestionResponse)
async def develop_question(req: DevelopQuestionRequest):
    try:
        return await ask_service.develop_question(req)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "DEVELOP_QUESTION_ERROR", "message": str(e)}
        )

@router.post("/re-research", response_model=ReResearchResponse)
async def re_research_question(req: ReResearchRequest):
    try:
        return await ask_service.re_research_question(req)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "RE_RESEARCH_ERROR", "message": str(e)}
        )

@router.post("/pdf/scan")
async def scan_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = pdf_scanner_service.scan_pdf_bytes(content, filename=file.filename or "uploaded.pdf")
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "PDF_SCAN_ERROR", "message": str(e)}
        )

# --- Security, Firewall & Auth Endpoints ---
from backend.app.core.firewall import firewall_state
from backend.app.services.email.email_service import email_service

_pending_otps: dict = {}

# Master Admin Credentials configuration on backend
MASTER_ADMIN_CONFIG = {
    "admin_id": "AOG",
    "username": "AOG",
    "password": "A@874",
    "role": "admin"
}

@router.get("/auth/smtp-status")
async def get_smtp_status():
    return email_service.get_public_config()

@router.post("/auth/smtp-config")
async def update_smtp_config(req: Request):
    try:
        body = await req.json()
        user = body.get("user", "").strip()
        password = body.get("password", "").strip()
        host = body.get("host", "smtp.gmail.com").strip()
        port = int(body.get("port", 587))
        from_name = body.get("from_name", "Neurobridge Stark Academy").strip()
        
        if not user or not password:
            raise HTTPException(status_code=400, detail="Sender email and password are required")
        
        updated = email_service.update_config(user=user, password=password, host=host, port=port, from_name=from_name)
        return {"status": "success", "message": "SMTP settings saved successfully", "config": updated}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/auth/smtp-test")
async def test_smtp_configuration(req: Request):
    try:
        body = await req.json()
        recipient = body.get("recipient", "").strip()
        user = body.get("user", "").strip()
        password = body.get("password", "").strip()
        host = body.get("host", "smtp.gmail.com").strip()
        port = int(body.get("port", 587))
        from_name = body.get("from_name", "Neurobridge Stark Academy").strip()

        if user and password:
            email_service.update_config(user=user, password=password, host=host, port=port, from_name=from_name)

        result = email_service.test_connection(to_email=recipient or None)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/auth/send-otp")
async def send_otp(req: Request):
    try:
        body = await req.json()
        email = body.get("email", "").strip().lower()
        username = body.get("username", "").strip()
        otp = str(body.get("otp", "")).strip()
        
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="A valid email address is required")
        if not otp:
            # Generate 6-digit OTP if not provided
            import random
            otp = f"{random.randint(100000, 999999)}"
        
        import time
        _pending_otps[email] = {
            "otp": otp,
            "username": username or email.split("@")[0],
            "created_at": time.time(),
            "expires_at": time.time() + 300, # 5 minutes
            "attempts": 0
        }
        
        # Real transmission via Gmail SMTP
        smtp_result = email_service.send_otp_email(email, username or email.split("@")[0], otp)
        
        if smtp_result.get("success"):
            return {
                "status": "success",
                "message": f"Verification code sent directly to your Gmail: {email}",
                "email": email,
                "dispatched": True,
                "is_live_delivery": True,
                "channel": "live_gmail_smtp",
                "otp_preview": otp,
                "expires_in_seconds": 300,
            }
        else:
            return {
                "status": "success",
                "message": f"Email could not be delivered to {email}: Google SMTP requires a 16-character App Password.",
                "email": email,
                "otp_preview": otp,
                "dispatched": False,
                "is_live_delivery": False,
                "channel": "simulated_fallback",
                "smtp_status": smtp_result,
                "expires_in_seconds": 300,
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/auth/verify-otp")
async def verify_otp(req: Request):
    try:
        body = await req.json()
        email = body.get("email", "").strip().lower()
        otp = str(body.get("otp", "")).strip()
        
        record = _pending_otps.get(email)
        if not record:
            return {"status": "error", "valid": False, "message": "No active OTP verification session for this email. Please request a new code."}
        
        import time
        if time.time() > record["expires_at"]:
            del _pending_otps[email]
            return {"status": "error", "valid": False, "message": "Verification code expired. Please request a new OTP."}

        record["attempts"] += 1
        if record["attempts"] > 5:
            del _pending_otps[email]
            return {"status": "error", "valid": False, "message": "Exceeded maximum attempts. Please request a fresh OTP."}

        if record["otp"] == otp:
            username = record["username"]
            del _pending_otps[email]
            return {
                "status": "success",
                "valid": True,
                "message": f"Email {email} verified successfully!",
                "username": username
            }
        
        return {
            "status": "error",
            "valid": False,
            "message": f"Invalid OTP code. {5 - record['attempts']} attempts remaining."
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Dedicated Isolated Admin Authentication Endpoint
@router.post("/admin/login")
async def admin_login(req: Request):
    client_ip = req.client.host if req.client else "127.0.0.1"
    
    # Check IP lockout first
    if firewall_state.is_ip_blocked(client_ip):
        return {
            "success": False,
            "error": "IP is quarantined by Neurobridge Firewall due to brute force protection.",
            "blocked": True
        }

    try:
        body = await req.json()
        admin_id = body.get("admin_id", "").strip().lower()
        password = body.get("password", "").strip()

        is_id_match = (
            admin_id == MASTER_ADMIN_CONFIG["admin_id"].lower() or
            admin_id == MASTER_ADMIN_CONFIG["username"].lower() or
            admin_id == "aog" or
            admin_id == "admin"
        )

        if is_id_match and password == MASTER_ADMIN_CONFIG["password"]:
            firewall_state.reset_ip(client_ip)
            import base64, time
            now = int(time.time())
            token = f"nb_adm_sec_{now}_{client_ip.replace('.', '_')}"
            return {
                "success": True,
                "session": {
                    "token": token,
                    "admin_id": MASTER_ADMIN_CONFIG["admin_id"],
                    "username": MASTER_ADMIN_CONFIG["username"],
                    "role": "admin",
                    "issued_at": now * 1000,
                    "expires_at": (now + 7200) * 1000
                }
            }
        
        # Failed attempt
        result = firewall_state.record_failed_attempt(client_ip, "/api/v1/admin/login")
        if result["locked"]:
            return {
                "success": False,
                "error": "Max failed attempts reached. Your IP has been quarantined by the Firewall.",
                "locked": True
            }

        return {
            "success": False,
            "error": f"Invalid Admin Credentials. ({result['remaining']} attempts remaining before IP lockdown)",
            "remaining_attempts": result["remaining"]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/security/firewall-status")
@router.get("/admin/public-status")
async def get_firewall_status(req: Request):
    client_host = req.client.host if req.client else "127.0.0.1"
    return {
        "status": "active" if firewall_state.enabled else "disabled",
        "firewall": "Neurobridge Shield Active Defense WAF v2.6",
        "mode": "strict" if firewall_state.strict_mode else "permissive",
        "client_ip": client_host,
        "is_quarantined": firewall_state.is_ip_blocked(client_host),
        "threats_blocked": firewall_state.threats_blocked_count,
        "blocked_ips_count": len(firewall_state.blocked_ips),
        "whitelisted_ips_count": len(firewall_state.whitelisted_ips)
    }

@router.get("/admin/firewall/events")
async def get_firewall_events():
    return {
        "count": len(firewall_state.intrusion_events),
        "events": firewall_state.intrusion_events
    }

@router.post("/admin/firewall/unblock-ip")
async def unblock_ip(req: Request):
    body = await req.json()
    ip = body.get("ip", "").strip()
    if ip:
        firewall_state.reset_ip(ip)
        return {"status": "success", "message": f"IP {ip} has been unblocked from the firewall."}
    return {"status": "error", "message": "IP parameter is required"}

@router.post("/admin/firewall/block-ip")
async def block_ip(req: Request):
    body = await req.json()
    ip = body.get("ip", "").strip()
    if ip:
        firewall_state.blocked_ips.add(ip)
        firewall_state.log_event("MANUAL_BLOCK", ip, "/admin", "high", "Manually quarantined by Administrator")
        return {"status": "success", "message": f"IP {ip} added to firewall blacklist."}
    return {"status": "error", "message": "IP parameter is required"}


# --- World Intelligence, Current Affairs & Today's Fact Endpoints ---
from backend.app.services.news.news_service import news_service

@router.get("/news/feed")
async def get_news_feed(category: Optional[str] = None):
    """Returns world news feed with optional category filter and today's fact."""
    return news_service.get_feed(category=category)

@router.get("/news/today-fact")
async def get_today_fact():
    """Returns the daily Mind-Blowing Fact & GK Booster."""
    return news_service.get_today_fact()

@router.post("/news/refresh")
async def refresh_news_feed():
    """Syncs live world intelligence and latest global dispatches."""
    return news_service.sync_latest()
