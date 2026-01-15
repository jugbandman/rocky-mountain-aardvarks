#!/bin/bash
# Ralph Wiggum Loop for Rocky Mountain Aardvarks
# Usage: ./ralph.sh [max_iterations]

MAX_ITERATIONS=${1:-30}
COMPLETION_SIGNAL="COMPLETE"

echo "🎸 Starting Ralph Wiggum Loop"
echo "   Max iterations: $MAX_ITERATIONS"
echo "   Completion signal: $COMPLETION_SIGNAL"
echo "   Project: Rocky Mountain Aardvarks"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Iteration $i of $MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Run Claude with the prompt file (skip permissions for autonomous mode)
    OUTPUT=$(claude --dangerously-skip-permissions -p "$(cat PROMPT.md)" 2>&1)

    # Show output
    echo "$OUTPUT"

    # Check for completion signal
    if echo "$OUTPUT" | grep -q "$COMPLETION_SIGNAL"; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 Ralph completed after $i iterations!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 0
    fi

    # Brief pause between iterations
    sleep 2
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "   Check activity.md and plan.md for progress"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 1
