from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pathlib import Path
import os
from backend.app.core.config import settings
from backend.app.api.v1.endpoints import router as api_v1_router
from backend.app.core.firewall import FirewallMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Strict CORS configuration (Item 11: Hardened against overly permissive settings)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "https://my-hackthon.onrender.com",
    "https://my-hackthon-api.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https://([a-zA-Z0-9-]+\.)?(onrender\.com|vercel\.app)$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Admin-Token", "X-Requested-With", "Accept"],
)

# Active Defense Firewall & WAF Middleware
app.add_middleware(FirewallMiddleware)

# API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/api/v1/ping")
async def ping():
    return {"status": "ok", "service": "neurobridge-api"}

# Serve frontend build if dist folder exists
dist_candidates = [
    (settings.BASE_DIR.parent / "frontend" / "dist").resolve(),
    (settings.BASE_DIR / "frontend" / "dist").resolve(),
    Path("frontend/dist").resolve(),
    Path("dist").resolve(),
]
dist_dir = None
for cand in dist_candidates:
    if cand.exists() and (cand / "index.html").exists():
        dist_dir = cand
        break

if dist_dir:
    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    images_dir = dist_dir / "images"
    if images_dir.exists():
        app.mount("/images", StaticFiles(directory=str(images_dir)), name="images")

    @app.get("/")
    async def serve_spa_root():
        return FileResponse(str(dist_dir / "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("api"):
            return {"error": "API route not found"}
        target = dist_dir / full_path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
        # If target has directory with index.html
        if target.exists() and target.is_dir() and (target / "index.html").exists():
            return FileResponse(str(target / "index.html"))
        # SPA fallback to root index.html
        return FileResponse(str(dist_dir / "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "project": settings.PROJECT_NAME,
            "docs": f"{settings.API_V1_STR}/docs",
            "health": f"{settings.API_V1_STR}/health",
            "status": f"{settings.API_V1_STR}/ai/status"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
