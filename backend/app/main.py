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

# CORS configuration for Vite frontend (supports local dev, Vercel deployments, and custom domains)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        target = dist_dir / full_path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
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
