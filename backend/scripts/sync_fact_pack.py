import json
from pathlib import Path

BASE_DIR = Path(r"c:\Users\HP\OneDrive\Attachments\Desktop\NEW PROJECT")
BACKEND_FACTS_PATH = BASE_DIR / "backend" / "data" / "facts" / "academic_facts.json"
FACT_PACK_PATH = BASE_DIR / "frontend" / "src" / "ai" / "facts" / "factPack.ts"

with open(BACKEND_FACTS_PATH, "r", encoding="utf-8") as f:
    academic_facts = json.load(f)

content = FACT_PACK_PATH.read_text(encoding="utf-8")

target_marker = "\n];\n\nexport const VERIFIED_FACTS"
target_idx = content.find(target_marker)
if target_idx == -1:
    print("Error: Could not find target marker in factPack.ts")
    exit(1)

existing_ts_code = content[:target_idx]

new_entries = []
for f in academic_facts:
    f_id = f["id"]
    if f_id not in existing_ts_code:
        json_str = json.dumps(f, indent=2, ensure_ascii=False)
        indented = "\n".join("  " + line for line in json_str.split("\n"))
        new_entries.append(indented + ",")

if new_entries:
    added_code = ",\n" + "\n".join(new_entries)
    new_content = content[:target_idx] + added_code + content[target_idx:]
    FACT_PACK_PATH.write_text(new_content, encoding="utf-8")
    print(f"Successfully added {len(new_entries)} academic facts to BUILTIN_FACTS in factPack.ts")
else:
    print("All academic facts already present in factPack.ts")
