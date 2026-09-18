import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../lib/api";

const INITIAL_ELEMENTS = [
  { emoji: "💧", name: "Water" },
  { emoji: "🔥", name: "Fire" },
  { emoji: "💨", name: "Wind" },
  { emoji: "🌍", name: "Earth" },
];

export default function CraftBoard() {
  const [sidebarItems, setSidebarItems] = useState(INITIAL_ELEMENTS);
  const [boardItems, setBoardItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [combiningIds, setCombiningIds] = useState([]);

  const mainAreaRef = useRef(null);

  const getViewportPosition = (e, targetElement) => {
    const itemWidth = targetElement?.offsetWidth || 92;
    const itemHeight = targetElement?.offsetHeight || 62;

    return {
      x: e.clientX - itemWidth / 2,
      y: e.clientY - itemHeight / 2,
    };
  };

  const getCanvasRelativePosition = (e, targetElement) => {
    if (!mainAreaRef.current) {
      return { x: 0, y: 0 };
    }

    const rect = mainAreaRef.current.getBoundingClientRect();
    const itemWidth = targetElement?.offsetWidth || 92;
    const itemHeight = targetElement?.offsetHeight || 62;

    return {
      x: Math.max(
        0,
        Math.min(e.clientX - rect.left - itemWidth / 2, rect.width - itemWidth),
      ),
      y: Math.max(
        0,
        Math.min(e.clientY - rect.top - itemHeight / 2, rect.height - itemHeight),
      ),
    };
  };

  const pointInObject = (e, element) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    return (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
  };

  const handlePointerDown = (e) => {
    const clickedItemNode = e.target.closest(".sidebar-card, .board-card");

    if (!clickedItemNode) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const emoji = clickedItemNode.dataset.emoji;
    const name = clickedItemNode.dataset.name;
    const isBoardItem = clickedItemNode.classList.contains("board-card");
    const boardId = clickedItemNode.dataset.id;

    if (isBoardItem && combiningIds.includes(boardId)) {
      return;
    }

    const pos = getViewportPosition(e, clickedItemNode);

    setDraggedItem({
      id: isBoardItem ? boardId : `${Date.now()}-${Math.random()}`,
      name,
      emoji,
      x: pos.x,
      y: pos.y,
    });

    if (isBoardItem && pointInObject(e, mainAreaRef.current)) {
      setBoardItems((prev) => prev.filter((item) => item.id !== boardId));
    }
  };

  useEffect(() => {
    if (!draggedItem) return;

    const handleWindowPointerMove = (e) => {
      const draggedNode = document.getElementById("dragged-card-ghost");
      const pos = getViewportPosition(e, draggedNode);

      setDraggedItem((prev) =>
        prev
          ? {
              ...prev,
              x: pos.x,
              y: pos.y,
            }
          : null,
      );
    };

    const handleWindowPointerUp = (e) => {
      if (pointInObject(e, mainAreaRef.current)) {
        const draggedNode = document.getElementById("dragged-card-ghost");
        const canvasPos = getCanvasRelativePosition(e, draggedNode);
        const collisionItem = checkCollision(draggedNode);

        const droppedDraggedItem = {
          id: draggedItem.id,
          name: draggedItem.name,
          emoji: draggedItem.emoji,
          x: canvasPos.x,
          y: canvasPos.y,
        };

        setBoardItems((prev) => [...prev, droppedDraggedItem]);

        if (collisionItem) {
          combineItems(droppedDraggedItem, collisionItem, canvasPos);
        }
      }

      setDraggedItem(null);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [draggedItem]);

  const checkCollision = (draggedNode) => {
    if (!draggedNode || !mainAreaRef.current) {
      return null;
    }

    const itemRect = draggedNode.getBoundingClientRect();
    const targetNodes = mainAreaRef.current.querySelectorAll(".board-card");

    for (const targetNode of targetNodes) {
      if (targetNode === draggedNode) continue;

      const targetId = targetNode.dataset.id;

      if (combiningIds.includes(targetId)) {
        continue;
      }

      const targetRect = targetNode.getBoundingClientRect();

      const collide =
        itemRect.left <= targetRect.right &&
        itemRect.right >= targetRect.left &&
        itemRect.top <= targetRect.bottom &&
        itemRect.bottom >= targetRect.top;

      if (collide) {
        return boardItems.find((item) => item.id === targetId) || null;
      }
    }

    return null;
  };

  const combineItems = async (item1, item2, dropPos) => {
    const pairIds = [item1.id, item2.id];

    setCombiningIds((prev) => [...prev, ...pairIds]);

    try {
      const response = await fetch(`${API_BASE_URL}/craft/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item1: item1.name,
          item2: item2.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Combine request failed");
      }

      const newItemData = await response.json();

      setBoardItems((prev) => [
        ...prev.filter((item) => item.id !== item1.id && item.id !== item2.id),
        {
          id: `${Date.now()}-${Math.random()}`,
          name: newItemData.name,
          emoji: newItemData.emoji,
          x: dropPos.x,
          y: dropPos.y,
        },
      ]);

      setSidebarItems((prev) => {
        if (prev.some((element) => element.name === newItemData.name)) {
          return prev;
        }

        return [
          ...prev,
          {
            emoji: newItemData.emoji,
            name: newItemData.name,
          },
        ];
      });
    } catch (err) {
      console.error("Combination Error:", err);
    } finally {
      setCombiningIds((prev) => prev.filter((id) => !pairIds.includes(id)));
    }
  };

  const handleClearBoard = () => {
    setBoardItems([]);
  };

  const handleResetAll = () => {
    setBoardItems([]);
    setSidebarItems(INITIAL_ELEMENTS);
  };

  return (
    <div
      data-theme="craft"
      className="
        relative
        w-full
        select-none
        font-sans
        text-zinc-100
      "
      onPointerDown={handlePointerDown}
    >
      {/* =========================================
          MAIN WORKSPACE
      ========================================== */}
      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800/80
          bg-zinc-950
          shadow-[0_20px_80px_rgba(0,0,0,0.28)]
        "
      >
        {/* Ambient purple glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[var(--color-accent-glow)]
            opacity-40
            blur-[120px]
          "
        />

        {/* =========================================
            WORKSPACE HEADER
        ========================================== */}
        <div
          className="
            relative
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-zinc-800/70
            px-5
            py-4
            sm:px-7
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-accent)]
                shadow-[0_0_10px_var(--color-accent-glow)]
              "
            />

            <span
              className="
                text-xs
                font-mono
                font-bold
                uppercase
                tracking-[0.14em]
                text-zinc-200
              "
            >
              Infinite Craft
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              text-[10px]
              font-mono
              uppercase
              tracking-wider
            "
          >
            <span className="hidden sm:inline text-zinc-600">Discovered</span>

            <span className="font-bold text-[var(--color-accent)]">
              {sidebarItems.length}
            </span>

            <span className="text-zinc-800">/</span>

            <span className="hidden sm:inline text-zinc-600">Active</span>

            <span className="font-bold text-zinc-300">{boardItems.length}</span>
          </div>
        </div>

        {/* =========================================
            CRAFTING CANVAS
        ========================================== */}
        <div
          id="main-area"
          ref={mainAreaRef}
          className="
            relative
            h-[420px]
            overflow-hidden
            bg-zinc-950
            sm:h-[500px]
            lg:h-[540px]
          "
        >
          {/* Subtle coordinate grid */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.045]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  to right,
                  rgba(255,255,255,0.4) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.4) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Empty state */}
          {boardItems.length === 0 && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  mb-4
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.24em]
                  text-zinc-700
                "
              >
                Workspace Empty
              </div>

              <div
                className="
                  text-lg
                  font-mono
                  font-semibold
                  text-zinc-500
                  sm:text-xl
                "
              >
                Combine concepts
              </div>

              <div
                className="
                  mt-2
                  max-w-xs
                  text-[10px]
                  font-mono
                  leading-relaxed
                  text-zinc-700
                  sm:text-xs
                "
              >
                Drag two elements into the workspace to generate something new.
              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-3
                  text-xl
                  opacity-30
                "
              >
                <span>💧</span>
                <span className="text-sm text-zinc-700">+</span>
                <span>🔥</span>
                <span className="text-sm text-zinc-700">→</span>
                <span>✦</span>
              </div>
            </div>
          )}

          {/* =========================================
              BOARD ELEMENTS
          ========================================== */}
          {boardItems.map((item) => {
            const isCombining = combiningIds.includes(item.id);

            return (
              <div
                key={item.id}
                data-id={item.id}
                data-name={item.name}
                data-emoji={item.emoji}
                style={{
                  position: "absolute",
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                }}
                className={`
                  board-card
                  absolute
                  z-10
                  flex
                  w-[84px]
                  cursor-grab
                  touch-none
                  flex-col
                  items-center
                  rounded-lg
                  border
                  px-2.5
                  py-2.5
                  transition-all
                  duration-200
                  active:cursor-grabbing
                  ${
                    isCombining
                      ? `
                        pointer-events-none
                        scale-90
                        border-[var(--color-accent)]/70
                        bg-[var(--color-accent-glow)]
                        opacity-65
                        shadow-[0_0_28px_var(--color-accent-glow)]
                        animate-pulse
                      `
                      : `
                        border-zinc-800
                        bg-zinc-900/90
                        shadow-[0_10px_30px_rgba(0,0,0,0.28)]
                        hover:-translate-y-1
                        hover:border-[var(--color-accent)]/60
                        hover:bg-zinc-900
                        hover:shadow-[0_10px_30px_rgba(0,0,0,0.42)]
                      `
                  }
                `}
              >
                <span className="text-xl leading-none sm:text-2xl">
                  {item.emoji}
                </span>

                <span
                  className="
                    mt-1.5
                    max-w-full
                    truncate
                    text-center
                    text-[9px]
                    font-mono
                    font-medium
                    tracking-wide
                    text-zinc-400
                  "
                >
                  {item.name}
                </span>

                {isCombining && (
                  <span
                    className="
                      mt-1
                      text-[7px]
                      font-mono
                      uppercase
                      tracking-[0.16em]
                      text-[var(--color-accent)]
                    "
                  >
                    Synthesizing
                  </span>
                )}
              </div>
            );
          })}

          {/* Canvas metadata */}
          <span
            className="
              pointer-events-none
              absolute
              left-4
              top-4
              text-[8px]
              font-mono
              uppercase
              tracking-[0.18em]
              text-zinc-800
            "
          >
            X / 000
          </span>

          <span
            className="
              pointer-events-none
              absolute
              right-4
              top-4
              text-[8px]
              font-mono
              uppercase
              tracking-[0.18em]
              text-zinc-800
            "
          >
            CANVAS
          </span>
        </div>

        {/* =========================================
            INVENTORY DOCK
        ========================================== */}
        <div
          className="
            relative
            border-t
            border-zinc-800/70
            bg-zinc-950
            px-5
            py-4
            sm:px-7
          "
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="
                  text-[10px]
                  font-mono
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-zinc-500
                "
              >
                Unlocked Elements
              </span>

              <span className="text-[9px] font-mono text-zinc-700">
                {sidebarItems.length}
              </span>
            </div>

            <span
              className="
                hidden
                text-[9px]
                font-mono
                uppercase
                tracking-wider
                text-zinc-700
                sm:inline
              "
            >
              Drag into workspace
            </span>
          </div>

          <div
            id="sidebar"
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-zinc-800
            "
          >
            {sidebarItems.map((item) => (
              <div
                key={item.name}
                data-name={item.name}
                data-emoji={item.emoji}
                className="
                  sidebar-card
                  group
                  inline-flex
                  shrink-0
                  cursor-grab
                  touch-none
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-zinc-800
                  bg-zinc-900/60
                  px-3
                  py-2
                  transition-all
                  duration-150
                  active:cursor-grabbing
                  hover:border-[var(--color-accent)]/50
                  hover:bg-zinc-900
                "
              >
                <span className="text-sm leading-none">{item.emoji}</span>

                <span
                  className="
                    text-[10px]
                    font-mono
                    font-medium
                    text-zinc-400
                    transition-colors
                    group-hover:text-zinc-200
                  "
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            CONTROL STRIP
        ========================================== */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-zinc-900
            px-5
            py-3
            sm:px-7
          "
        >
          <span
            className="
              text-[8px]
              font-mono
              uppercase
              tracking-[0.18em]
              text-zinc-800
            "
          >
            LLM Combination Workspace
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearBoard}
              className="
                rounded-md
                px-3
                py-1.5
                text-[9px]
                font-mono
                uppercase
                tracking-wider
                text-zinc-600
                transition
                hover:bg-zinc-900
                hover:text-zinc-300
              "
            >
              Clear
            </button>

            <button
              onClick={handleResetAll}
              className="
                rounded-md
                px-3
                py-1.5
                text-[9px]
                font-mono
                uppercase
                tracking-wider
                text-zinc-600
                transition
                hover:bg-zinc-900
                hover:text-[var(--color-accent)]
              "
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          DRAG GHOST
      ========================================== */}
      {draggedItem && (
        <div
          id="dragged-card-ghost"
          data-name={draggedItem.name}
          data-emoji={draggedItem.emoji}
          style={{
            position: "fixed",
            left: `${draggedItem.x}px`,
            top: `${draggedItem.y}px`,
            pointerEvents: "none",
          }}
          className="
            dragged-card
            fixed
            z-50
            flex
            min-w-[84px]
            flex-col
            items-center
            rounded-lg
            border
            border-[var(--color-accent)]/70
            bg-zinc-900
            px-3
            py-2.5
            text-[var(--color-accent)]
            shadow-[0_18px_50px_var(--color-accent-glow)]
            scale-105
          "
        >
          <span className="text-xl leading-none">{draggedItem.emoji}</span>

          <span className="mt-1.5 text-[9px] font-mono font-semibold">
            {draggedItem.name}
          </span>
        </div>
      )}
    </div>
  );
}
