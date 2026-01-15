#!/bin/bash
# Ralph Wiggum Loop for Rocky Mountain Aardvarks
# v2 - Rate limit aware
#
# Usage: ./ralph.sh [max_iterations] [wait_on_limit]
#   max_iterations: default 30
#   wait_on_limit: "true" to wait 1 hour on rate limit, default exits

MAX_ITERATIONS=${1:-30}
WAIT_ON_LIMIT=${2:-false}
COMPLETION_SIGNAL="COMPLETE"
RATE_LIMIT_SIGNAL="You've hit your limit"

echo "🎸 Starting Ralph Wiggum Loop"
echo "   Max iterations: $MAX_ITERATIONS"
echo "   Wait on limit: $WAIT_ON_LIMIT"
echo "   Completion signal: $COMPLETION_SIGNAL"
echo "   Project: Rocky Mountain Aardvarks"
echo "   Started: $(date)"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Iteration $i of $MAX_ITERATIONS - $(date '+%H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Run Claude with the prompt file (skip permissions for autonomous mode)
    OUTPUT=$(claude --dangerously-skip-permissions -p "$(cat PROMPT.md)" 2>&1)

    # Show output
    echo "$OUTPUT"

    # Rate limit detection - exit gracefully instead of burning iterations
    if echo "$OUTPUT" | grep -q "$RATE_LIMIT_SIGNAL"; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "⏸️  Rate limit hit at iteration $i"
        echo "   Time: $(date)"

        if [ "$WAIT_ON_LIMIT" = "true" ]; then
            echo "   Waiting 1 hour before retry..."
            sleep 3600
            continue
        else
            echo "   Exiting gracefully. Progress saved in activity.md"
            echo "   Run again after limit resets."
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            exit 2
        fi
    fi

    # Check for completion signal
    if echo "$OUTPUT" | grep -q "$COMPLETION_SIGNAL"; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 Ralph completed after $i iterations!"
        echo "   Time: $(date)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 0
    fi

    # Brief pause between iterations
    sleep 2
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "   Time: $(date)"
echo "   Check activity.md and plan.md for progress"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 1
