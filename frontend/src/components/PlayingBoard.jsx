import React, { useState } from "react";
import PlayingCard from "./PlayingCard";
import { Game, actions } from "engine-blackjack";

const createCustomGame = () => {
  const defaultState = new Game().getState();

  return new Game({
    ...defaultState,
    rules: {
      ...defaultState.rules,
      insurance: false,
      surrender: false,
      showdownAfterAceSplit: false,
    },
  });
};

export default function PlayingBoard({ onHint }) {
  const [game, setGame] = useState(createCustomGame);
  const [gameState, setGameState] = useState(() => game.getState());
  const [chips, setChips] = useState(500);
  const [bet, setBet] = useState(0);

  const handleAction = (action) => {
    game.dispatch(action);

    const nextState = {
      ...game.getState(),
    };

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
    setGameState({
      ...freshGame.getState(),
    });
    setBet(0);
  };

  const requestDQN = async (currentHand, canDouble, canSplit) => {
    const hand = gameState?.handInfo?.[currentHand];

    if (!hand || !hand.playerValue) return;

    const playerValue = hand.playerValue.hi;
    const dealerValue = gameState?.dealerValue?.hi || 0;
    const isSoft = hand.playerValue.hi > hand.playerValue.lo;

    try {
      const response = await fetch("http://127.0.0.1:8000/blackjack/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_value: playerValue,
          dealer_value: dealerValue,
          is_soft: isSoft,
          can_double: canDouble || false,
          can_split: canSplit || false,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();

      if (onHint && data) {
        onHint(data);
      }
    } catch (err) {
      console.error("DQN Predict Error:", err);
    }
  };

  const stage = gameState?.stage;

  const isPlayerTurn =
    stage === "player-turn-right" || stage === "player-turn-left";

  const isBetting = stage === "ready";
  const isDone = stage === "done";

  const currentHand = stage === "player-turn-left" ? "left" : "right";

  const isRightHandActive = isPlayerTurn && currentHand === "right";

  const isLeftHandActive = isPlayerTurn && currentHand === "left";

  const getHandScore = (handValueObj) => {
    if (!handValueObj) return 0;

    return handValueObj.hi < 22 ? handValueObj.hi : handValueObj.lo;
  };

  const dealerValue = isDone
    ? getHandScore(gameState?.dealerValue)
    : gameState?.dealerCards?.[0]?.value || 0;

  const rightHandValue = getHandScore(gameState?.handInfo?.right?.playerValue);

  const leftHandValue = getHandScore(gameState?.handInfo?.left?.playerValue);

  const getHandOutcome = (handKey) => {
    if (!isDone || !gameState?.handInfo?.[handKey]) {
      return null;
    }

    const hand = gameState.handInfo[handKey];

    if (!hand.cards || hand.cards.length === 0) {
      return null;
    }

    const wonAmount =
      handKey === "right" ? gameState.wonOnRight : gameState.wonOnLeft;

    if (wonAmount > hand.bet) {
      return {
        label: `WIN +${wonAmount}€`,
        className: "text-emerald-400",
      };
    }

    if (wonAmount === hand.bet && hand.bet > 0) {
      return {
        label: "PUSH",
        className: "text-amber-400",
      };
    }

    return {
      label: "LOSS",
      className: "text-rose-400",
    };
  };

  const rightOutcome = getHandOutcome("right");
  const leftOutcome = getHandOutcome("left");

  return (
    <div
      data-theme="casino"
      className="
        w-full
        select-none
        font-sans
        text-[var(--color-text)]
      "
    >
      {/* Main table */}
      <div
        className="
          relative
          w-full
          min-h-[500px]
          sm:min-h-[540px]
          rounded-2xl
          border
          border-zinc-800/80
          bg-zinc-950/40
          overflow-hidden
        "
      >
        {/* Ambient table glow */}
        <div
          className="
            absolute
            inset-0
            pointer-events-none
            bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.055),transparent_58%)]
          "
        />

        <div className="relative h-full min-h-[500px] sm:min-h-[540px] flex flex-col px-5 sm:px-8 py-5 sm:py-6">
          {/* Table header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/70">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white">
                Blackjack
              </span>
            </div>

            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono">
              <span className="text-zinc-500">
                Chips
                <span className="ml-2 text-emerald-400 font-bold">
                  {chips}€
                </span>
              </span>

              {isBetting && bet > 0 && (
                <span className="text-zinc-500">
                  Bet
                  <span className="ml-2 text-amber-400 font-bold">{bet}€</span>
                </span>
              )}

              <span className="hidden sm:inline text-zinc-600">
                {isBetting && "READY"}
                {isPlayerTurn && `TURN / ${currentHand.toUpperCase()}`}
                {stage === "dealer-turn" && "DEALER TURN"}
                {isDone && "COMPLETE"}
              </span>
            </div>
          </div>

          {/* Game area */}
          <div className="flex-1 flex flex-col justify-between py-8 sm:py-10">
            {/* Dealer */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                  Dealer
                </span>

                {dealerValue > 0 && (
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {dealerValue}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-[112px] sm:min-h-[144px]">
                {(gameState?.dealerCards || []).map((card, index) => (
                  <PlayingCard
                    key={`dealer-${card.suite}-${card.text}-${index}`}
                    suit={card.suite}
                    value={card.text}
                    hidden={false}
                  />
                ))}

                {gameState?.dealerHoleCard && !isDone && (
                  <PlayingCard
                    suit={gameState.dealerHoleCard.suite}
                    value={gameState.dealerHoleCard.text}
                    hidden
                  />
                )}
              </div>
            </div>

            {/* Center divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-zinc-900" />

              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-700">
                vs
              </span>

              <div className="flex-1 h-px bg-zinc-900" />
            </div>

            {/* Player zone */}
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-14">
              {/* Split hand */}
              {gameState?.handInfo?.left &&
                gameState.handInfo.left.cards?.length > 0 && (
                  <div
                    className={`
                      flex
                      flex-col
                      items-center
                      transition-all
                      duration-300
                      ${
                        isLeftHandActive
                          ? "opacity-100 -translate-y-1"
                          : "opacity-45"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`
                          text-[10px]
                          font-mono
                          uppercase
                          tracking-[0.16em]
                          ${
                            isLeftHandActive
                              ? "text-emerald-400"
                              : "text-zinc-600"
                          }
                        `}
                      >
                        Split
                      </span>

                      {leftHandValue > 0 && (
                        <span className="text-sm font-mono font-bold text-zinc-200">
                          {leftHandValue}
                        </span>
                      )}

                      {leftOutcome && (
                        <span
                          className={`text-[9px] font-mono uppercase ${leftOutcome.className}`}
                        >
                          {leftOutcome.label}
                        </span>
                      )}
                    </div>

                    <div className="h-1 w-12 mb-3 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isLeftHandActive ? "w-full bg-emerald-400" : "w-0"
                        }`}
                      />
                    </div>

                    <div className="flex items-center -space-x-8 sm:-space-x-10">
                      {(gameState.handInfo.left.cards || []).map(
                        (card, index) => (
                          <PlayingCard
                            key={`left-${card.suite}-${card.text}-${index}`}
                            suit={card.suite}
                            value={card.text}
                            hidden={false}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Primary hand */}
              <div
                className={`
                  flex
                  flex-col
                  items-center
                  transition-all
                  duration-300
                  ${
                    isRightHandActive
                      ? "opacity-100 -translate-y-1"
                      : "opacity-100"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`
                      text-[10px]
                      font-mono
                      uppercase
                      tracking-[0.16em]
                      ${
                        isRightHandActive ? "text-emerald-400" : "text-zinc-500"
                      }
                    `}
                  >
                    Player
                  </span>

                  {rightHandValue > 0 && (
                    <span className="text-lg font-mono font-bold text-white">
                      {rightHandValue}
                    </span>
                  )}

                  {rightOutcome && (
                    <span
                      className={`text-[9px] font-mono uppercase ${rightOutcome.className}`}
                    >
                      {rightOutcome.label}
                    </span>
                  )}
                </div>

                <div className="h-1 w-14 mb-3 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isRightHandActive ? "w-full bg-emerald-400" : "w-0"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-[112px] sm:min-h-[144px]">
                  {(gameState?.handInfo?.right?.cards || []).map(
                    (card, index) => (
                      <PlayingCard
                        key={`right-${card.suite}-${card.text}-${index}`}
                        suit={card.suite}
                        value={card.text}
                        hidden={false}
                      />
                    ),
                  )}

                  {(!gameState?.handInfo?.right?.cards ||
                    gameState.handInfo.right.cards.length === 0) && (
                    <div
                      className="
                        w-20
                        h-28
                        sm:w-24
                        sm:h-36
                        rounded-xl
                        border
                        border-dashed
                        border-zinc-800
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-700">
                        Awaiting Bet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-5 border-t border-zinc-800/70">
            {isDone && (
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="
                    px-7
                    py-2.5
                    rounded-lg
                    bg-emerald-400
                    text-zinc-950
                    font-mono
                    font-bold
                    text-xs
                    uppercase
                    tracking-wider
                    hover:brightness-110
                    transition
                    active:scale-95
                  "
                >
                  New Hand
                </button>
              </div>
            )}

            {isBetting && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleAction(actions.deal({ bet }));
                    setChips((prev) => prev - bet);
                  }}
                  disabled={bet === 0 || bet > chips}
                  className="
                    order-2
                    sm:order-1
                    px-7
                    py-2.5
                    rounded-lg
                    bg-emerald-400
                    text-zinc-950
                    font-mono
                    font-bold
                    text-xs
                    uppercase
                    tracking-wider
                    transition
                    hover:brightness-110
                    active:scale-95
                    disabled:opacity-30
                    disabled:pointer-events-none
                  "
                >
                  Deal
                  {bet > 0 ? ` · ${bet}€` : ""}
                </button>

                <div className="order-1 sm:order-2 flex items-center gap-1 p-1 rounded-lg border border-zinc-800 bg-zinc-950/70">
                  {[5, 20, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBet((prev) => prev + amount)}
                      disabled={bet + amount > chips}
                      className="
                        px-3
                        py-1.5
                        rounded-md
                        text-xs
                        font-mono
                        text-zinc-400
                        hover:text-emerald-400
                        hover:bg-zinc-900
                        transition
                        disabled:opacity-30
                        disabled:pointer-events-none
                      "
                    >
                      +{amount}€
                    </button>
                  ))}

                  {bet > 0 && (
                    <button
                      onClick={() => setBet(0)}
                      className="
                        px-2
                        py-1.5
                        text-[10px]
                        font-mono
                        text-zinc-600
                        hover:text-rose-400
                        uppercase
                        transition
                      "
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {isPlayerTurn && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() =>
                    handleAction(
                      actions.hit({
                        position: currentHand,
                      }),
                    )
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-zinc-900
                    border
                    border-zinc-800
                    text-zinc-200
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    hover:border-zinc-600
                    hover:text-white
                    transition
                    active:scale-95
                  "
                >
                  Hit
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      actions.stand({
                        position: currentHand,
                      }),
                    )
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-zinc-900
                    border
                    border-zinc-800
                    text-zinc-200
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    hover:border-zinc-600
                    hover:text-white
                    transition
                    active:scale-95
                  "
                >
                  Stand
                </button>

                <button
                  onClick={() => {
                    const currentHandBet =
                      gameState?.handInfo?.[currentHand]?.bet || bet;

                    handleAction(
                      actions.double({
                        position: currentHand,
                      }),
                    );

                    setChips((prev) => prev - currentHandBet);
                  }}
                  disabled={
                    !gameState?.handInfo?.[currentHand]?.availableActions
                      ?.double ||
                    chips < (gameState?.handInfo?.[currentHand]?.bet || bet)
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-zinc-900
                    border
                    border-zinc-800
                    text-zinc-200
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    hover:border-zinc-600
                    hover:text-white
                    transition
                    active:scale-95
                    disabled:opacity-25
                    disabled:pointer-events-none
                  "
                >
                  Double
                </button>

                <button
                  onClick={() => {
                    const currentHandBet =
                      gameState?.handInfo?.[currentHand]?.bet || bet;

                    handleAction(
                      actions.split({
                        position: currentHand,
                      }),
                    );

                    setChips((prev) => prev - currentHandBet);
                  }}
                  disabled={
                    !gameState?.handInfo?.[currentHand]?.availableActions
                      ?.split ||
                    chips < (gameState?.handInfo?.[currentHand]?.bet || bet)
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-zinc-900
                    border
                    border-zinc-800
                    text-zinc-200
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    hover:border-zinc-600
                    hover:text-white
                    transition
                    active:scale-95
                    disabled:opacity-25
                    disabled:pointer-events-none
                  "
                >
                  Split
                </button>

                {/* DQN request */}
                <button
                  onClick={() =>
                    requestDQN(
                      currentHand,
                      gameState?.handInfo?.[currentHand]?.availableActions
                        ?.double,
                      gameState?.handInfo?.[currentHand]?.availableActions
                        ?.split,
                    )
                  }
                  className="
                    ml-1
                    px-5
                    py-2.5
                    rounded-lg
                    bg-emerald-500/[0.07]
                    border
                    border-emerald-500/35
                    text-emerald-400
                    font-mono
                    font-bold
                    text-xs
                    uppercase
                    tracking-wider
                    hover:bg-emerald-500/[0.12]
                    hover:border-emerald-400/60
                    transition
                    active:scale-95
                  "
                >
                  Ask DQN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
