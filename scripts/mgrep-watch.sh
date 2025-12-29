#!/bin/bash

# mgrep-watch.sh - Helper script to manage mgrep watch process

WATCH_LOG="/tmp/mgrep-watch.log"
WATCH_PID_FILE="/tmp/mgrep-watch.pid"

case "$1" in
  start)
    # Check if already running
    if [ -f "$WATCH_PID_FILE" ]; then
      PID=$(cat "$WATCH_PID_FILE")
      if ps -p "$PID" > /dev/null 2>&1; then
        echo "mgrep watch is already running (PID: $PID)"
        exit 1
      else
        echo "Removing stale PID file"
        rm "$WATCH_PID_FILE"
      fi
    fi

    # Start mgrep watch in background
    nohup mgrep watch > "$WATCH_LOG" 2>&1 &
    PID=$!
    echo $PID > "$WATCH_PID_FILE"
    echo "mgrep watch started (PID: $PID)"
    echo "Log file: $WATCH_LOG"
    ;;

  stop)
    if [ ! -f "$WATCH_PID_FILE" ]; then
      echo "mgrep watch is not running"
      exit 1
    fi

    PID=$(cat "$WATCH_PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
      kill $PID
      echo "mgrep watch stopped (PID: $PID)"
    else
      echo "mgrep watch process not found"
    fi
    rm "$WATCH_PID_FILE"
    ;;

  status)
    if [ ! -f "$WATCH_PID_FILE" ]; then
      echo "mgrep watch is not running"
      exit 1
    fi

    PID=$(cat "$WATCH_PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
      echo "mgrep watch is running (PID: $PID)"
      echo ""
      echo "Recent log entries:"
      tail -5 "$WATCH_LOG"
    else
      echo "mgrep watch process not found"
      rm "$WATCH_PID_FILE"
      exit 1
    fi
    ;;

  restart)
    $0 stop
    sleep 1
    $0 start
    ;;

  *)
    echo "Usage: $0 {start|stop|status|restart}"
    echo ""
    echo "Commands:"
    echo "  start   - Start mgrep watch in background"
    echo "  stop    - Stop mgrep watch"
    echo "  status  - Show mgrep watch status and recent logs"
    echo "  restart - Restart mgrep watch"
    exit 1
    ;;
esac
