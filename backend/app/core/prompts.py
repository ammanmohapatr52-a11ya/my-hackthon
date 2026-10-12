from pathlib import Path
from backend.app.core.config import settings

class PromptManager:
    def __init__(self, prompts_dir: Path = settings.PROMPTS_DIR):
        self.prompts_dir = prompts_dir
        self.system_master: str = ""
        self.router: str = ""
        self.gk_protocol: str = ""
        self.level1: str = ""
        self.level2: str = ""
        self.level3: str = ""
        self.verifier: str = ""
        self.load_all()

    def load_all(self):
        self.system_master = self._read_file("system_master.md")
        self.router = self._read_file("router.md")
        self.gk_protocol = self._read_file("gk_protocol.md")
        self.level1 = self._read_file("level1.md")
        self.level2 = self._read_file("level2.md")
        self.level3 = self._read_file("level3.md")
        self.verifier = self._read_file("verifier.md")

    def _read_file(self, filename: str) -> str:
        filepath = self.prompts_dir / filename
        if not filepath.exists():
            raise FileNotFoundError(f"Required prompt file not found: {filepath}")
        return filepath.read_text(encoding="utf-8")

    def get_level_modifier(self, level: int) -> str:
        if level == 1:
            return self.level1
        elif level == 3:
            return self.level3
        return self.level2

prompt_manager = PromptManager()
