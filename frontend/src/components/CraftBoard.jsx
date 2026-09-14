import React, { useState, useRef, useEffect } from "react";

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
  const [combiningIds, setCombiningIds] = useState([]); // Tracks items awaiting API response

  const mainAreaRef = useRef(null);

  // Calculates viewport offset for the ghost element following the cursor
  const getViewportPosition = (e, targetElement) => {
    const itemWidth = targetElement?.offsetWidth || 110;
    const itemHeight = targetElement?.offsetHeight || 38;

    return {
      x: e.clientX - itemWidth / 2,
      y: e.clientY - itemHeight / 2,
    };
  };

  // Calculates position relative to the #main-area canvas
  const getCanvasRelativePosition = (e, targetElement) => {
    if (!mainAreaRef.current) return { x: 0, y: 0 };
    const rect = mainAreaRef.current.getBoundingClientRect();
    const itemWidth = targetElement?.offsetWidth || 110;
    const itemHeight = targetElement?.offsetHeight || 38;

    return {
      x: e.clientX - rect.left - itemWidth / 2,
      y: e.clientY - rect.top - itemHeight / 2,
    };
  };

  // Helper checking if mouse coordinates are inside canvas area
  const mouseInObject = (e, element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
  };

  // Mouse Down Handler for picking up items from inventory or board
  const handleMouseDown = (e) => {
    const clickedItemNode = e.target.closest(".sidebar-card, .board-card");
    if (!clickedItemNode) return;

    const emoji = clickedItemNode.dataset.emoji;
    const name = clickedItemNode.dataset.name;
    const isBoardItem = clickedItemNode.classList.contains("board-card");
    const boardId = clickedItemNode.dataset.id;

    // Ignore clicks on items currently combining
    if (isBoardItem && combiningIds.includes(boardId)) return;

    const pos = getViewportPosition(e, clickedItemNode);

    setDraggedItem({
      id: isBoardItem ? boardId : Date.now().toString(),
      name,
      emoji,
      x: pos.x,
      y: pos.y,
    });

    if (isBoardItem && mouseInObject(e, mainAreaRef.current)) {
      setBoardItems((prev) => prev.filter((item) => item.id !== boardId));
    }
  };

  // Global Window Event Listeners
  useEffect(() => {
    if (!draggedItem) return;

    const handleWindowMouseMove = (e) => {
      const draggedNode = document.getElementById("dragged-card-ghost");
      const pos = getViewportPosition(e, draggedNode);

      setDraggedItem((prev) => (prev ? { ...prev, x: pos.x, y: pos.y } : null));
    };

    const handleWindowMouseUp = (e) => {
      if (mouseInObject(e, mainAreaRef.current)) {
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

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [draggedItem]);

  // AABB Collision Detection
  const checkCollision = (draggedNode) => {
    if (!draggedNode || !mainAreaRef.current) return null;

    const itemRect = draggedNode.getBoundingClientRect();
    const targetNodes = mainAreaRef.current.querySelectorAll(".board-card");

    for (const targetNode of targetNodes) {
      if (targetNode === draggedNode) continue;

      const targetId = targetNode.dataset.id;
      // Skip colliding with items that are already combining
      if (combiningIds.includes(targetId)) continue;

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

  // API Call to Combine Items
  const combineItems = async (item1, item2, dropPos) => {
    const pairIds = [item1.id, item2.id];

    // Lock both items while waiting for API
    setCombiningIds((prev) => [...prev, ...pairIds]);

    try {
      const response = await fetch(`http://127.0.0.1:8000/craft/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item1: item1.name, item2: item2.name }),
      });

      if (!response.ok) throw new Error("Combine request failed");

      const newItemData = await response.json();

      setBoardItems((prev) => [
        ...prev.filter((i) => i.id !== item1.id && i.id !== item2.id),
        {
          id: Date.now().toString(),
          name: newItemData.name,
          emoji: newItemData.emoji,
          x: dropPos.x,
          y: dropPos.y,
        },
      ]);

      setSidebarItems((prev) => {
        if (prev.some((el) => el.name === newItemData.name)) return prev;
        return [...prev, { emoji: newItemData.emoji, name: newItemData.name }];
      });
    } catch (err) {
      console.error("Combination Error:", err);
    } finally {
      // Unlock item IDs if request finishes or fails
      setCombiningIds((prev) => prev.filter((id) => !pairIds.includes(id)));
    }
  };

  const handleClearBoard = () => setBoardItems([]);
  const handleResetAll = () => {
    setBoardItems([]);
    setSidebarItems(INITIAL_ELEMENTS);
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 select-none font-sans"
      onMouseDown={handleMouseDown}
    >
      <div className="relative rounded-2xl border border-color-border bg-color-main/80 p-6 sm:p-8 flex flex-col gap-6 shadow-xl min-h-[580px] justify-between">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-color-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-color-accent" />
            <h1 className="text-sm font-semibold font-mono tracking-wide text-color-text uppercase">
              Infinite Craft
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-2.5 py-1 rounded-md bg-color-secondary/80 border border-color-border/60 text-color-text/80">
              Discovered:{" "}
              <span className="text-color-accent font-semibold">
                {sidebarItems.length}
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-color-secondary/80 border border-color-border/60 text-color-text/80">
              Active:{" "}
              <span className="text-color-accent font-semibold">
                {boardItems.length}
              </span>
            </div>
          </div>
        </div>

        {/* CRAFTING CANVAS DROP AREA */}
        <div
          id="main-area"
          ref={mainAreaRef}
          className="relative w-full h-80 sm:h-96 rounded-xl bg-color-main/60 border border-color-border/60 overflow-hidden shadow-inner flex items-center justify-center my-auto"
        >
          {boardItems.length === 0 && (
            <span className="text-xs font-mono text-color-text/30 pointer-events-none">
              Drag elements here from the inventory below
            </span>
          )}

          {/* Cards on the Board */}
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
                className={`board-card absolute z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs font-semibold shadow-md cursor-pointer hover:border-color-accent transition-colors ${
                  isCombining
                    ? "pointer-events-none opacity-50 animate-pulse"
                    : ""
                }`}
              >
                <span className="text-sm leading-none">{item.emoji}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* INVENTORY / SIDEBAR PALETTE */}
        <div className="flex flex-col gap-2.5 bg-color-secondary/40 border border-color-border/60 rounded-xl p-4">
          <div className="flex items-center justify-between border-b border-color-border/40 pb-2">
            <span className="text-xs font-mono text-color-text/50 uppercase tracking-wider">
              Unlocked Elements
            </span>
            <span className="text-[10px] font-mono text-color-text/40">
              {sidebarItems.length} Items
            </span>
          </div>

          <div
            id="sidebar"
            className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1"
          >
            {sidebarItems.map((item) => (
              <div
                key={item.name}
                data-name={item.name}
                data-emoji={item.emoji}
                className="sidebar-card inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-color-secondary border border-color-border/80 text-color-text font-mono text-xs font-medium hover:border-color-accent hover:text-color-accent transition cursor-pointer"
              >
                <span className="text-sm leading-none">{item.emoji}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="border-t border-color-border/60 pt-4 flex items-center justify-end gap-3 min-h-[56px]">
          <button
            onClick={handleClearBoard}
            className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95"
          >
            Clear Canvas
          </button>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* DRAGGED GHOST CARD (FOLLOWS CURSOR) */}
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
          className="dragged-card fixed z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-color-secondary border-2 border-color-accent text-color-accent font-mono text-xs font-semibold shadow-2xl scale-105"
        >
          <span className="text-base leading-none">{draggedItem.emoji}</span>
          <span>{draggedItem.name}</span>
        </div>
      )}
    </div>
  );
}
