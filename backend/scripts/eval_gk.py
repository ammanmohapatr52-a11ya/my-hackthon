import asyncio
import json
import os
import sys
from datetime import date
from pathlib import Path

# Add backend directory to path
backend_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_root))

from backend.app.schemas.ai import AskRequest
from backend.app.services.ai.ask_service import ask_service

async def run_evaluation(provider_name: str = "fake"):
    eval_file = Path(__file__).resolve().parent.parent / "eval" / "gk_questions.jsonl"
    results_dir = Path(__file__).resolve().parent.parent / "eval" / "results"
    results_dir.mkdir(parents=True, exist_ok=True)

    if not eval_file.exists():
        print(f"Error: Eval file not found at {eval_file}")
        return

    questions = []
    with open(eval_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                questions.append(json.loads(line))

    print(f"\n=======================================================")
    print(f"Running General Knowledge Evaluation Harness ({len(questions)} cases)")
    print(f"Provider: {provider_name}")
    print(f"=======================================================\n")

    math_total = 0
    math_correct = 0
    false_premise_total = 0
    false_premise_corrected = 0
    time_sensitive_total = 0
    time_sensitive_caveats = 0
    speakable_clean = 0
    total_evaluated = len(questions)

    detailed_results = []

    for item in questions:
        q_text = item["question"]
        category = item["category"]
        expected_route = item["expected_route"]
        is_ts = item.get("time_sensitive", False)

        req = AskRequest(
            question=q_text,
            level=2,
            provider=provider_name
        )

        resp = await ask_service.answer_question(req)

        # 1. Math check
        if category == "math":
            math_total += 1
            if resp.route == "math_engine" and resp.math_redirect:
                math_correct += 1

        # 2. False premise check
        if category == "false_premise":
            false_premise_total += 1
            ans_text = (resp.explanation.answer if resp.explanation else "").lower()
            if "canberra" in ans_text or "not the capital" in ans_text:
                false_premise_corrected += 1

        # 3. Time sensitive caveat check
        if is_ts and resp.route in ["gk", "explain"]:
            time_sensitive_total += 1
            if resp.explanation and resp.explanation.time_sensitive and resp.explanation.caveat:
                time_sensitive_caveats += 1

        # 4. Speakable check (no markdown symbols, no emoji)
        spoken_text = resp.explanation.spoken if resp.explanation else ""
        has_symbols = any(c in spoken_text for c in ["#", "*", "`", "~", "[", "]"])
        if not has_symbols and len(spoken_text) > 0:
            speakable_clean += 1

        detailed_results.append({
            "id": item["id"],
            "question": q_text,
            "category": category,
            "route": resp.route,
            "answer": resp.explanation.answer if resp.explanation else "",
            "confidence": resp.explanation.confidence if resp.explanation else "",
            "time_sensitive": resp.explanation.time_sensitive if resp.explanation else False,
            "caveat": resp.explanation.caveat if resp.explanation else "",
            "latency_ms": resp.latency_ms
        })
        print(f"[{item['id']}] {q_text[:40]:<40} -> Route: {resp.route:<12} ({resp.latency_ms}ms)")

    # Compute Metrics
    math_pct = (math_correct / math_total * 100) if math_total else 100
    fp_pct = (false_premise_corrected / false_premise_total * 100) if false_premise_total else 100
    ts_pct = (time_sensitive_caveats / time_sensitive_total * 100) if time_sensitive_total else 100
    speakable_pct = (speakable_clean / total_evaluated * 100)

    summary = {
        "date": date.today().isoformat(),
        "provider": provider_name,
        "total_questions": total_evaluated,
        "metrics": {
            "math_routing_accuracy": f"{math_pct:.1f}%",
            "false_premise_correction_rate": f"{fp_pct:.1f}%",
            "time_sensitive_caveat_rate": f"{ts_pct:.1f}%",
            "speakable_clean_rate": f"{speakable_pct:.1f}%"
        },
        "results": detailed_results
    }

    out_file = results_dir / f"eval-{provider_name}-{date.today().isoformat()}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n------------------ EVALUATION SUMMARY ------------------")
    print(f"Math Routed to Engine:            {math_correct}/{math_total} ({math_pct:.1f}%) [Target: 100%]")
    print(f"False-Premises Corrected:         {false_premise_corrected}/{false_premise_total} ({fp_pct:.1f}%) [Target: >=80%]")
    print(f"Time-Sensitive Caveats Present:   {time_sensitive_caveats}/{time_sensitive_total} ({ts_pct:.1f}%) [Target: 100%]")
    print(f"Speakable Output (No Markdown):   {speakable_clean}/{total_evaluated} ({speakable_pct:.1f}%) [Target: >=95%]")
    print(f"Detailed output saved to: {out_file}")
    print("--------------------------------------------------------\n")

if __name__ == "__main__":
    provider = sys.argv[1] if len(sys.argv) > 1 else "fake"
    asyncio.run(run_evaluation(provider))
