#!/bin/bash
set -e

MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Ralph with Claude Code"
echo "📋 Max iterations: $MAX_ITERATIONS"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "═══════════════════════════════════════"
    echo "🔄 Iteration $i of $MAX_ITERATIONS"
    echo "═══════════════════════════════════════"

    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" \
        | claude --dangerously-skip-permissions 2>&1 \
        | tee /dev/stderr) || true

    if echo "$OUTPUT" | grep -q "<ralph>COMPLETE</ralph>"; then
        echo ""
        echo "✅ All stories complete!"
        echo "🎉 Ralph finished successfully"
        exit 0
    fi

    echo ""
    echo "⏳ Waiting 2 seconds before next iteration..."
    sleep 2
done

echo ""
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "📋 Check prd.json for remaining stories"
exit 1
