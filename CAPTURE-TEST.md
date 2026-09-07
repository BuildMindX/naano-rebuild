# Capture Test

## Tool and model
- **Tool:** Claude Code (CLI), invoked here via the VSCode extension host for the main
  build session, and via the headless `claude -p` CLI for the two independent canary
  tests below.
- **Model:** Sonnet 5 (`claude-sonnet-5`). Single model plans and executes in this
  session — no separate planner/executor split.

## Mechanism
Claude Code hooks, configured in [.claude/settings.json](.claude/settings.json):

- `UserPromptSubmit` fires on every prompt the user submits. Its JSON stdin payload
  includes `session_id`, `transcript_path`, `cwd`, and the verbatim `prompt` text.
- `Stop` fires at the end of every turn. Its JSON stdin payload includes `session_id`
  and (on this Claude Code build) a `last_assistant_message` field containing the
  final assistant text directly — no transcript parsing required. As a fallback for
  builds that don't provide that field, the script also parses `transcript_path`
  (the session's `.jsonl` transcript) and takes the last `assistant`-type entry's
  text content.

Both events run [.claude/hooks/capture.py](.claude/hooks/capture.py), which:
1. Looks up (or creates) a per-session log file in `.agent-logs/` named
   `YYYY-MM-DD_HH-MM-SS_<session-id>.md`, keyed by `session_id` so every session gets
   its own file regardless of which terminal/window started it.
2. Appends a `[LOG_ENTRY type=PROMPT ...]` block on `UserPromptSubmit` or a
   `[LOG_ENTRY type=RESPONSE ...]` block on `Stop`, each with a UTC timestamp and the
   model name.
3. Updates the file's frontmatter (`total_exchanges`, `last_prompt_time`).

Nothing is invoked manually — both hooks are registered declaratively in
`.claude/settings.json`, which Claude Code loads for any session started in this repo.

## Log file path for the canaries
- `.agent-logs/2026-09-07_17-53-54_27b9429d-7f58-4176-b3e5-50569637ec16.md` (session 1)
- `.agent-logs/2026-09-07_17-54-05_508e05cc-a833-4437-ae66-c0aa9c331c7f.md` (session 2)

Two **independent** sessions were used (not two prompts in one session) by launching
`claude -p "<canary>"` twice from a plain shell — each invocation gets its own
`session_id` and therefore its own log file, proving the hook is installed at the
project level and not something that only works inside the session that created it.

## Canary entries (raw, pasted from the files above)

### Session 1 — `27b9429d`
```
[LOG_ENTRY type=PROMPT num=1 session=27b9429d]
timestamp: 2026-09-07T17:53:54.249Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Husnain Ali


[LOG_ENTRY type=RESPONSE num=1 session=27b9429d]
timestamp: 2026-09-07T17:54:01.206Z
model: claude-sonnet-5

The repo is essentially empty — just a blank `readme.md`, `.git`, `.claude/`, and `.agent-logs/`. There's no actual assignment content here yet.

What would you like me to do for the 8x assignment? For example: do you have a spec/prompt to work from, or should I start by drafting the readme based on requirements you'll share?
```

### Session 2 — `508e05cc`
```
[LOG_ENTRY type=PROMPT num=1 session=508e05cc]
timestamp: 2026-09-07T17:54:05.166Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Husnain Ali (session 2)


[LOG_ENTRY type=RESPONSE num=1 session=508e05cc]
timestamp: 2026-09-07T17:54:41.535Z
model: claude-sonnet-5

This is a logging/hook test setup — `.claude/settings.json` wires `UserPromptSubmit` and `Stop` hooks to `.claude/hooks/capture.py`, which appends each prompt/response into a per-session markdown log under `.agent-logs/`.

Your prompt just got captured correctly: `.agent-logs/2026-09-07_17-54-05_508e05cc-a833-4437-ae66-c0aa9c331c7f.md` has the `PROMPT num=1` entry with this exact message. Once I finish responding, the `Stop` hook should fire and append the corresponding `RESPONSE num=1` entry and bump `total_exchanges` to 1.

There's also a second, near-duplicate log file (`..._27b9429d-...md`) from the same minute — likely a separate session/duplicate hook fire. Let me know if you want me to check that one or verify the response entry gets written after this turn.
```

## What did not work first try
The first canary attempt used a `Stop`-hook implementation that only parsed
`transcript_path` (the session's `.jsonl` transcript) for the last `assistant`-type
entry's text. On the very first run (headless `claude -p`), the RESPONSE entry came
back as `(no text response captured for this turn)` — the transcript read at hook
time did not yield the assistant text reliably (likely a timing/flush issue against
the on-disk transcript in headless mode). Rather than fight that race, I added debug
instrumentation (`CAPTURE_DEBUG=1` env var, writes the raw hook stdin to
`/tmp/capture_debug.log`) and discovered the `Stop` payload on this Claude Code build
already includes a `last_assistant_message` field with the final response text
directly. Switched the script to prefer that field, keeping the transcript parse only
as a fallback for builds/hook payloads that don't provide it. Re-ran both canaries
clean after the fix — both landed correctly, shown above. The debug instrumentation
is still in the script (inert unless `CAPTURE_DEBUG=1` is set) since it's harmless and
useful if the payload shape changes again.
