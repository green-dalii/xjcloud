#!/bin/bash
# dev-local.sh — 同时启动 Workers 后端 + Next.js 前端（本地开发模式）
#
# Workers (wrangler dev --local): localhost:8787，本地模拟 D1 读写
# Next.js:                     localhost:3001
#
# Ctrl+C 退出时自动清理所有子进程

set -e

cleanup() {
  echo ""
  echo "🛑 正在关闭所有服务..."
  if [ -n "$WORKERS_PID" ] && kill -0 "$WORKERS_PID" 2>/dev/null; then
    kill "$WORKERS_PID" 2>/dev/null
    wait "$WORKERS_PID" 2>/dev/null
  fi
  if [ -n "$NEXT_PID" ] && kill -0 "$NEXT_PID" 2>/dev/null; then
    kill "$NEXT_PID" 2>/dev/null
    wait "$NEXT_PID" 2>/dev/null
  fi
  echo "✅ 所有服务已关闭"
  exit 0
}

trap cleanup INT TERM

echo "🚀 启动本地开发环境..."
echo ""

# 启动 Workers
echo "├─ Workers 后端 (http://localhost:8787)"
cd workers && npx wrangler dev --local &
WORKERS_PID=$!

# 等待 Workers 就绪
sleep 1

# 启动 Next.js
echo "├─ Next.js 前端 (http://localhost:3001)"
cd "$(dirname "$0")/.." && PORT=3001 pnpm dev &
NEXT_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 前后端已启动"
echo "   前端:     http://localhost:3001"
echo "   后端:     http://localhost:8787"
echo "   按 Ctrl+C 停止所有服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 等待任一子进程退出
wait -n $WORKERS_PID $NEXT_PID 2>/dev/null
# 如果某个子进程提前退出，清理其余
cleanup
