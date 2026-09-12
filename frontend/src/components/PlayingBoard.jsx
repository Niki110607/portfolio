import React, { useState } from "react";
import PlayingCard from "./PlayingCard";
import { Game, actions } from "engine-blackjack";

const SUIT_SYMBOLS = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const createCustomGame = () => {
  const defaultState = new Game().getState();
  const initialState = {
    ...defaultState,
    rules: {
      ...defaultState.rules,
      insurance: false,
      surrender: false,
      showdownAfterAceSplit: false,
    },
  };
  return new Game(initialState);
};

export default function PlayingBoard() {
  const [game, setGame] = useState(createCustomGame);
  const [gameState, setGameState] = useState(() => game.getState());
  const [chips, setChips] = useState(500);
  const [bet, setBet] = useState(0);

  const handleAction = (action) => {
    game.dispatch(action);
    const nextState = { ...game.getState() };
    setGameState(nextState);

    if (nextState.stage === "done") {
      setChips(
        (prev) =>
          prev + (nextState.wonOnLeft || 0) + (nextState.wonOnRight || 0),
      );
    }
  };

  const handleReset = () => {
    const freshGame = createCustomGame();
    setGame(freshGame);
    setGameState({ ...freshGame.getState() });
    setBet(0);
  };

  // Stage & state derives
  const stage = gameState?.stage;
  const isPlayerTurn =
    stage === "player-turn-right" || stage === "player-turn-left";
  const isBetting = stage === "ready";
  const isDone = stage === "done";

  const currentHand = stage === "player-turn-left" ? "left" : "right";
  const isRightHandActive = isPlayerTurn && currentHand === "right";
  const isLeftHandActive = isPlayerTurn && currentHand === "left";

  const dealerValue =
    gameState?.dealerValue?.hi < 22
      ? gameState?.dealerValue?.hi
      : gameState?.dealerValue?.lo;
  const rightHandValue =
    gameState?.handInfo?.right?.playerValue?.hi < 22
      ? gameState?.handInfo?.right?.playerValue?.hi
      : gameState?.handInfo?.right?.playerValue?.lo;
  const leftHandValue =
    gameState?.handInfo?.left?.playerValue?.hi < 22
      ? gameState?.handInfo?.left?.playerValue?.hi
      : gameState?.handInfo?.left?.playerValue?.lo;

  // Outcome status builder for completed hands
  const getHandOutcome = (handKey) => {
    if (!isDone || !gameState?.handInfo?.[handKey]) return null;
    const hand = gameState.handInfo[handKey];

    // Do not show outcome if hand has no cards (unused split hand)
    if (!hand.cards || hand.cards.length === 0) return null;

    const wonAmount =
      handKey === "right" ? gameState.wonOnRight : gameState.wonOnLeft;

    if (wonAmount > hand.bet) {
      return {
        label: `WIN (+${wonAmount}€)`,
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      };
    }
    if (wonAmount === hand.bet && hand.bet > 0) {
      return {
        label: "DRAW",
        color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      };
    }
    return {
      label: "LOSS",
      color: "text-red-400/70 border-red-500/20 bg-red-500/5",
    };
  };

  const rightOutcome = getHandOutcome("right");
  const leftOutcome = getHandOutcome("left");

  const getStageBadge = () => {
    if (isBetting)
      return {
        label: "Ready to Deal",
        color: "text-color-text/50 border-color-border/60",
      };
    if (isPlayerTurn)
      return {
        label: `Your Turn (${currentHand})`,
        color: "text-color-accent border-color-accent/40",
      };
    if (stage === "dealer-turn")
      return {
        label: "Dealer Turn",
        color: "text-amber-400/80 border-amber-500/30",
      };
    if (isDone)
      return {
        label: "Hand Complete",
        color: "text-emerald-400/80 border-emerald-500/30",
      };
    return {
      label: stage || "Active",
      color: "text-color-text/60 border-color-border/60",
    };
  };

  const stageBadge = getStageBadge();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 select-none font-sans">
      {/* Table Container */}
      <div className="relative rounded-2xl border border-color-border bg-color-main/80 p-6 sm:p-8 flex flex-col gap-8 min-h-[600px] justify-between">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-color-border/60 pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-color-accent" />
              <h1 className="text-sm font-semibold font-mono tracking-wide text-color-text uppercase">
                Blackjack
              </h1>
            </div>

            {/* Bankroll & Current Bet Display */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="px-2.5 py-1 rounded-md bg-color-secondary/80 border border-color-border/60 text-color-text/80">
                Chips:{" "}
                <span className="text-color-accent font-semibold">
                  {chips}€
                </span>
              </div>
              {isBetting && bet > 0 && (
                <div className="px-2.5 py-1 rounded-md bg-color-secondary/80 border border-color-border/60 text-color-text/80">
                  Bet:{" "}
                  <span className="text-amber-400 font-semibold">{bet}€</span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`px-2.5 py-0.5 rounded-md border text-xs font-mono tracking-wide ${stageBadge.color}`}
          >
            {stageBadge.label}
          </div>
        </div>

        {/* DEALER ZONE */}
        <div className="flex flex-col items-center gap-3 my-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider text-color-text/50 uppercase">
              Dealer
            </span>
            {dealerValue !== undefined && dealerValue > 0 && (
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-color-secondary border border-color-border text-color-text/90">
                Score: {dealerValue}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 min-h-[112px] sm:min-h-[144px]">
            {(gameState?.dealerCards || []).map((card, index) => (
              <PlayingCard
                key={`dealer-${card.suite}-${card.value}-${index}`}
                suit={SUIT_SYMBOLS[card.suite]}
                value={card.text}
                hidden={false}
              />
            ))}

            {gameState?.dealerHoleCard && !isDone && (
              <PlayingCard
                suit={SUIT_SYMBOLS[gameState.dealerHoleCard.suite]}
                value={gameState.dealerHoleCard.text}
                hidden={true}
              />
            )}
          </div>
        </div>

        {/* PLAYER HANDS ZONE */}
        <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8 my-auto">
          {/* Split (Left) Hand - Render only if active/used */}
          {gameState?.handInfo?.left &&
            gameState.handInfo.left.cards?.length > 0 && (
              <div
                className={`flex flex-col items-center gap-3 p-3 rounded-xl border border-color-border/40 transition-all duration-200 ${
                  isLeftHandActive
                    ? "bg-color-secondary/50 opacity-100 -translate-y-1"
                    : isPlayerTurn
                      ? "bg-color-main/40 opacity-50"
                      : "bg-color-main/40 opacity-90"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono tracking-wider uppercase ${isLeftHandActive ? "text-color-accent font-semibold" : "text-color-text/40"}`}
                  >
                    Split ({gameState.handInfo.left.bet}€)
                  </span>

                  {leftHandValue !== undefined && (
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-color-secondary border border-color-border text-color-text/90">
                      Score: {leftHandValue}
                    </span>
                  )}

                  {/* Left Hand Outcome Badge */}
                  {leftOutcome && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${leftOutcome.color}`}
                    >
                      {leftOutcome.label}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  {(gameState.handInfo.left.cards || []).map((card, index) => (
                    <PlayingCard
                      key={`left-${card.suite}-${card.value}-${index}`}
                      suit={SUIT_SYMBOLS[card.suite]}
                      value={card.text}
                      hidden={false}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Primary (Right) Hand */}
          <div
            className={`flex flex-col items-center gap-3 p-3 rounded-xl border border-color-border/40 transition-all duration-200 ${
              isRightHandActive
                ? "bg-color-secondary/50 opacity-100 -translate-y-1"
                : isPlayerTurn
                  ? "bg-color-main/40 opacity-50"
                  : "bg-color-main/40 opacity-90"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono tracking-wider uppercase ${isRightHandActive ? "text-color-accent font-semibold" : "text-color-text/40"}`}
              >
                Player Hand{" "}
                {gameState?.handInfo?.right?.bet
                  ? `(${gameState.handInfo.right.bet}€)`
                  : ""}
              </span>

              {rightHandValue !== undefined && rightHandValue > 0 && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-color-secondary border border-color-border text-color-text/90">
                  Score: {rightHandValue}
                </span>
              )}

              {/* Right Hand Outcome Badge */}
              {rightOutcome && (
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${rightOutcome.color}`}
                >
                  {rightOutcome.label}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2.5 min-h-[112px] sm:min-h-[144px]">
              {(gameState?.handInfo?.right?.cards || []).map((card, index) => (
                <PlayingCard
                  key={`right-${card.suite}-${card.value}-${index}`}
                  suit={SUIT_SYMBOLS[card.suite]}
                  value={card.text}
                  hidden={false}
                />
              ))}

              {(!gameState?.handInfo?.right?.cards ||
                gameState.handInfo.right.cards.length === 0) && (
                <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border border-dashed border-color-border/40 bg-color-secondary/10 flex items-center justify-center">
                  <span className="text-xs font-mono text-color-text/30">
                    Place Bet
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="border-t border-color-border/60 pt-4 flex items-center justify-center min-h-[56px]">
          {/* New Hand Button */}
          {isDone && (
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-lg bg-color-accent text-color-main font-mono font-semibold text-xs tracking-wider uppercase transition-colors hover:brightness-110 active:scale-95"
            >
              New Hand
            </button>
          )}

          {/* Betting Phase Controls */}
          {isBetting && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleAction(actions.deal({ bet }));
                  setChips((prev) => prev - bet);
                }}
                disabled={bet === 0 || bet > chips}
                className="px-6 py-2 rounded-lg bg-color-accent text-color-main font-mono font-bold text-xs tracking-wider uppercase transition-colors hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                Deal {bet > 0 ? `(${bet}€)` : ""}
              </button>

              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-color-secondary/40 border border-color-border/60">
                <button
                  onClick={() => setBet((prev) => prev + 5)}
                  disabled={bet + 5 > chips}
                  className="px-3 py-1.5 rounded-md bg-color-secondary border border-color-border/80 text-color-text font-mono text-xs hover:border-color-accent hover:text-color-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  +5€
                </button>
                <button
                  onClick={() => setBet((prev) => prev + 20)}
                  disabled={bet + 20 > chips}
                  className="px-3 py-1.5 rounded-md bg-color-secondary border border-color-border/80 text-color-text font-mono text-xs hover:border-color-accent hover:text-color-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  +20€
                </button>
                <button
                  onClick={() => setBet((prev) => prev + 100)}
                  disabled={bet + 100 > chips}
                  className="px-3 py-1.5 rounded-md bg-color-secondary border border-color-border/80 text-color-text font-mono text-xs hover:border-color-accent hover:text-color-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  +100€
                </button>

                {bet > 0 && (
                  <button
                    onClick={() => setBet(0)}
                    className="px-2.5 py-1.5 text-xs font-mono text-color-text/50 hover:text-red-400 uppercase transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Player Actions Bar */}
          {isPlayerTurn && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() =>
                  handleAction(actions.hit({ position: currentHand }))
                }
                className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95"
              >
                Hit
              </button>

              <button
                onClick={() =>
                  handleAction(actions.stand({ position: currentHand }))
                }
                className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95"
              >
                Stand
              </button>

              <button
                onClick={() => {
                  handleAction(actions.double({ position: currentHand }));
                  setChips((prev) => prev - bet);
                }}
                disabled={
                  !gameState?.handInfo?.[currentHand]?.availableActions
                    ?.double || chips < bet
                }
                className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                Double
              </button>

              <button
                onClick={() => {
                  handleAction(actions.split({ position: currentHand }));
                  setChips((prev) => prev - bet);
                }}
                disabled={
                  !gameState?.handInfo?.[currentHand]?.availableActions
                    ?.split || chips < bet
                }
                className="px-4 py-2 rounded-lg bg-color-secondary border border-color-border text-color-text font-mono text-xs tracking-wider uppercase transition-colors hover:border-color-accent hover:text-color-accent active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                Split
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
