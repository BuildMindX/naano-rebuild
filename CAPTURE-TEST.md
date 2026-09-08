# Capture Test

## Tool and model
Claude Code (CLI) — the main build ran through the VSCode extension host, and the two
canary sessions below ran through the headless `claude -p` CLI directly. Model is
Sonnet 5 (`claude-sonnet-5`) throughout, one model doing both planning and execution,
no separate planner/executor.

## How the hook works
Wired through Claude Code hooks in [.claude/settings.json](.claude/settings.json).

`UserPromptSubmit` fires on every prompt. Its JSON stdin gives me `session_id`,
`transcript_path`, `cwd`, and the prompt text verbatim.

`Stop` fires at the end of every turn. On this Claude Code build its stdin payload
already includes a `last_assistant_message` field with the final response text, so I
didn't need to parse the transcript at all — I kept a transcript-parsing fallback in
the script anyway in case a different build doesn't send that field.

Both hooks run [.claude/hooks/capture.py](.claude/hooks/capture.py). It finds or
creates a per-session file in `.agent-logs/` named `YYYY-MM-DD_HH-MM-SS_<session-id>.md`
(keyed by session id, so it doesn't matter which terminal or window started the
session), appends a `PROMPT` or `RESPONSE` log block with a UTC timestamp and model
name, and bumps the file's frontmatter counters. Nothing here runs manually — both
hooks are just declared in `.claude/settings.json` and Claude Code picks them up for
any session started in this repo.

## Log files for the canaries
- `.agent-logs/2026-09-07_17-53-54_27b9429d-7f58-4176-b3e5-50569637ec16.md` (session 1)
- `.agent-logs/2026-09-07_17-54-05_508e05cc-a833-4437-ae66-c0aa9c331c7f.md` (session 2)

These are two genuinely separate sessions, not two prompts in one — I ran
`claude -p "<canary>"` twice from a plain shell, and each invocation got its own
session id and its own log file. That's the point: it shows the hook is installed at
the project level, not something that happens to work only in the session that set
it up.

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

## What didn't work on the first try
My first version of the `Stop` hook only parsed `transcript_path` for the last
`assistant`-type entry. On the very first run it came back with
`(no text response captured for this turn)` instead of the actual response — reading
the on-disk transcript right when the hook fires wasn't reliable in headless mode,
probably a timing/flush issue. Instead of chasing that race condition, I added a
`CAPTURE_DEBUG=1` flag that dumps the raw hook stdin to a temp file, ran it again, and
found the `Stop` payload on this build already hands you a `last_assistant_message`
field with the final text — no transcript parsing needed. Switched to that, kept the
transcript parse as a fallback, and both canaries landed clean after that. The debug
flag is still in the script; it's harmless when unset.

## One redaction, and why
Partway through the build I asked for deploy credentials, and the reply pasted a live
Vercel token and a Neon connection string straight into the chat. The hook logs
prompts verbatim, which is exactly right most of the time, but this repo is public —
shipping working credentials in `.agent-logs/` would have been a real leak, not a
style problem. So that one `PROMPT` entry (session `8ffc9948`, num=1) has the two
secret values swapped for `<...REDACTED>` markers with a note explaining why; nothing
else in that exchange was touched. It's the only edit made to any log entry in this
repo, and I'm calling it out here instead of doing it quietly.
