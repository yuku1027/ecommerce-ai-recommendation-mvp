#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Convert Markdown to DOCX with optional style template.

Usage:
  scripts/md_to_docx.sh <input.md> [output.docx] [reference.docx]

Examples:
  scripts/md_to_docx.sh docs/spec.md
  scripts/md_to_docx.sh docs/spec.md output/doc/spec.docx
  scripts/md_to_docx.sh docs/spec.md output/doc/spec.docx docs/templates/reference.docx
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 1 ]]; then
  usage
  exit 0
fi

INPUT_MD="$1"
OUTPUT_DOCX="${2:-}"
REFERENCE_DOCX="${3:-}"

if [[ ! -f "$INPUT_MD" ]]; then
  echo "Error: input markdown not found: $INPUT_MD" >&2
  exit 1
fi

if ! command -v pandoc >/dev/null 2>&1; then
  cat >&2 <<'EOF'
Error: pandoc is not installed.

Install on macOS (Homebrew):
  brew install pandoc

Then re-run this script.
EOF
  exit 1
fi

if [[ -z "$OUTPUT_DOCX" ]]; then
  base_name="$(basename "$INPUT_MD" .md)"
  OUTPUT_DOCX="output/doc/${base_name}.docx"
fi

mkdir -p "$(dirname "$OUTPUT_DOCX")"

pandoc_args=("$INPUT_MD" "-o" "$OUTPUT_DOCX")

if [[ -n "$REFERENCE_DOCX" ]]; then
  if [[ ! -f "$REFERENCE_DOCX" ]]; then
    echo "Error: reference docx not found: $REFERENCE_DOCX" >&2
    exit 1
  fi
  pandoc_args+=("--reference-doc=$REFERENCE_DOCX")
fi

pandoc "${pandoc_args[@]}"
echo "Generated: $OUTPUT_DOCX"
