#!/usr/bin/env python3
"""Capture hook for 8x assignment: logs prompt/response pairs to .agent-logs/.

Invoked by Claude Code hooks:
  - UserPromptSubmit -> `capture.py prompt`
  - Stop              -> `capture.py response`

Reads the hook JSON payload from stdin. Writes/updates a per-session
markdown log file under .agent-logs/.
"""
import json
import sys
import os
import glob
import re
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG_DIR = os.path.join(REPO_ROOT, ".agent-logs")
MODEL_NAME = "claude-sonnet-5"
TOOL_NAME = "claude-code"
PROJECT_NAME = "naano-rebuild"
AUTHOR = "husnainali"


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{datetime.now(timezone.utc).microsecond // 1000:03d}Z"


def find_session_file(session_id):
    matches = glob.glob(os.path.join(LOG_DIR, f"*_{session_id}.md"))
    return matches[0] if matches else None


def create_session_file(session_id, ts):
    os.makedirs(LOG_DIR, exist_ok=True)
    date_part = ts.split("T")[0]
    time_part = ts.split("T")[1].split(".")[0].replace(":", "-")
    fname = f"{date_part}_{time_part}_{session_id}.md"
    path = os.path.join(LOG_DIR, fname)
    short_id = session_id[:8]
    frontmatter = f"""---
session_id: {session_id}
date: {date_part}
author: {AUTHOR}
model: {MODEL_NAME}
tool: {TOOL_NAME}
project: {PROJECT_NAME}
total_exchanges: 0
first_prompt_time: {ts}
last_prompt_time: {ts}
---

# Session Log - {date_part}

Session: `{short_id}` | Project: `{PROJECT_NAME}` | Author: `{AUTHOR}`

---
"""
    with open(path, "w") as f:
        f.write(frontmatter)
    return path


def update_frontmatter(path, last_prompt_time=None, bump_exchanges=False):
    with open(path, "r") as f:
        content = f.read()
    if last_prompt_time:
        content = re.sub(
            r"^last_prompt_time: .*$",
            f"last_prompt_time: {last_prompt_time}",
            content, count=1, flags=re.MULTILINE,
        )
    if bump_exchanges:
        m = re.search(r"^total_exchanges: (\d+)$", content, flags=re.MULTILINE)
        if m:
            new_val = int(m.group(1)) + 1
            content = re.sub(
                r"^total_exchanges: \d+$",
                f"total_exchanges: {new_val}",
                content, count=1, flags=re.MULTILINE,
            )
    with open(path, "w") as f:
        f.write(content)


def next_num(path, entry_type):
    with open(path, "r") as f:
        content = f.read()
    nums = [int(n) for n in re.findall(rf"\[LOG_ENTRY type={entry_type} num=(\d+)", content)]
    return (max(nums) + 1) if nums else 1


def append_entry(path, entry_type, num, session_id, ts, text):
    short_id = session_id[:8]
    block = f"""
[LOG_ENTRY type={entry_type} num={num} session={short_id}]
timestamp: {ts}
model: {MODEL_NAME}

{text}

"""
    with open(path, "a") as f:
        f.write(block)


def extract_final_response(transcript_path):
    """Find the last assistant message's text content in the transcript JSONL."""
    if not transcript_path or not os.path.exists(transcript_path):
        return "(no transcript available)"
    last_text = None
    try:
        with open(transcript_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if entry.get("type") == "assistant":
                    msg = entry.get("message", {})
                    content = msg.get("content", [])
                    texts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
                    if texts:
                        combined = "\n".join(t for t in texts if t.strip())
                        if combined.strip():
                            last_text = combined
    except Exception as e:
        return f"(error reading transcript: {e})"
    return last_text if last_text else "(no text response captured for this turn)"


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("prompt", "response"):
        sys.exit(0)
    mode = sys.argv[1]
    raw_stdin = sys.stdin.read()
    try:
        payload = json.loads(raw_stdin)
    except Exception:
        payload = {}

    if os.environ.get("CAPTURE_DEBUG"):
        with open("/tmp/capture_debug.log", "a") as dbg:
            dbg.write(f"=== mode={mode} ===\n{raw_stdin}\n\n")

    session_id = payload.get("session_id", "unknown-session")
    ts = now_iso()

    path = find_session_file(session_id)
    if path is None:
        path = create_session_file(session_id, ts)

    if mode == "prompt":
        prompt_text = payload.get("prompt", "")
        num = next_num(path, "PROMPT")
        append_entry(path, "PROMPT", num, session_id, ts, prompt_text)
        update_frontmatter(path, last_prompt_time=ts)
    else:
        response_text = payload.get("last_assistant_message") or ""
        if not response_text.strip():
            response_text = extract_final_response(payload.get("transcript_path", ""))
        num = next_num(path, "RESPONSE")
        append_entry(path, "RESPONSE", num, session_id, ts, response_text)
        update_frontmatter(path, bump_exchanges=True)

    sys.exit(0)


if __name__ == "__main__":
    main()
