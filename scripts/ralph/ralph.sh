#!/bin/bash
set -e

MAX_ITERATIONS=${1:-30}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODEL="opus"

echo "🚀 Starting Ralph Multi-Agent System"
echo "📋 Max iterations: $MAX_ITERATIONS"
echo "🤖 Using model: $MODEL"
echo ""

run_agent() {
    local agent_name=$1
    local agent_file=$2
    local emoji=$3

    echo ""
    echo "$emoji Running $agent_name Agent..."
    echo "────────────────────────────────────"

    OUTPUT=$(cat "$SCRIPT_DIR/agents/$agent_file" \
        | claude --model $MODEL --dangerously-skip-permissions 2>&1 \
        | tee /dev/stderr) || true

    echo "$OUTPUT" > /tmp/ralph_last_output.txt
}

check_complete() {
    if grep -q "<ralph>COMPLETE</ralph>" /tmp/ralph_last_output.txt 2>/dev/null; then
        return 0
    fi
    return 1
}

for i in $(seq 1 $MAX_ITERATIONS); do
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "🔄 Cycle $i of $MAX_ITERATIONS"
    echo "═══════════════════════════════════════════════════════"

    # Phase 1: Product Manager reviews and prepares stories
    run_agent "Product Manager" "product-manager.md" "📋"

    if check_complete; then
        echo ""
        echo "✅ All stories complete!"
        echo "🎉 Ralph finished successfully"
        exit 0
    fi

    sleep 1

    # Phase 2: Developer implements ready stories
    run_agent "Developer" "developer.md" "💻"

    sleep 1

    # Phase 3: Tester verifies implemented stories
    run_agent "Tester" "tester.md" "🧪"

    if check_complete; then
        echo ""
        echo "✅ All stories complete!"
        echo "🎉 Ralph finished successfully"
        exit 0
    fi

    echo ""
    echo "⏳ Cycle complete. Waiting 2 seconds before next cycle..."
    sleep 2
done

echo ""
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "📋 Check prd.json for remaining stories"
exit 1
