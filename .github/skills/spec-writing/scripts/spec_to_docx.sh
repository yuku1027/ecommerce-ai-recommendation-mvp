#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Convert a spec Markdown file to DOCX.

Usage:
  scripts/spec_to_docx.sh <spec.md> [output.docx] [reference.docx]

Examples:
  scripts/spec_to_docx.sh ./spec-user-query-api.md
  scripts/spec_to_docx.sh ./spec-user-query-api.md output/doc/spec-user-query-api.docx
  scripts/spec_to_docx.sh ./spec-user-query-api.md output/doc/spec-user-query-api.docx ./docs/templates/reference.docx
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 1 ]]; then
  usage
  exit 0
fi

SPEC_MD="$1"
OUTPUT_DOCX="${2:-}"
REFERENCE_DOCX="${3:-}"

if [[ ! -f "$SPEC_MD" ]]; then
  echo "Error: spec markdown not found: $SPEC_MD" >&2
  exit 1
fi

if [[ ! -x "scripts/md_to_docx.sh" ]]; then
  echo "Error: scripts/md_to_docx.sh not found or not executable." >&2
  exit 1
fi

if [[ -n "$OUTPUT_DOCX" && -n "$REFERENCE_DOCX" ]]; then
  scripts/md_to_docx.sh "$SPEC_MD" "$OUTPUT_DOCX" "$REFERENCE_DOCX"
elif [[ -n "$OUTPUT_DOCX" ]]; then
  scripts/md_to_docx.sh "$SPEC_MD" "$OUTPUT_DOCX"
else
  scripts/md_to_docx.sh "$SPEC_MD"
fi
