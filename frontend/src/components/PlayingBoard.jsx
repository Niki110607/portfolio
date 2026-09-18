import React, { useState } from "react";

import PlayingCard from "./PlayingCard";
import { Game, actions } from "engine-blackjack";
import { API_BASE_URL } from "../lib/api";

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
      const response = await fetch(`${API_BASE_URL}/blackjack/predict`, {
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
      style={{ touchAction: "manipulation" }}
    >
      {/* Main table */}
      <div
        className="
          relative
          w-full
          min-h-[500px]
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800/80
          bg-zinc-950/40
          sm:min-h-[540px]
        "
      >
        {/* Ambient table glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.055),transparent_58%)]
          "
        />

        <div
          className="
            relative
            flex
            h-full
            min-h-[500px]
            flex-col
            px-5
            py-5
            sm:min-h-[540px]
            sm:px-8
            sm:py-6
          "
        >
          {/* Table header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-zinc-800/70
              pb-4
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.45)]
                "
              />

              <span
                className="
                  text-xs
                  font-mono
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  sm:text-sm
                "
              >
                Blackjack
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                text-[10px]
                font-mono
                sm:text-xs
              "
            >
              <span className="text-zinc-500">
                Chips
                <span className="ml-2 font-bold text-emerald-400">
                  {chips}€
                </span>
              </span>

              {isBetting && bet > 0 && (
                <span className="text-zinc-500">
                  Bet
                  <span className="ml-2 font-bold text-amber-400">{bet}€</span>
                </span>
              )}

              <span className="hidden text-zinc-600 sm:inline">
                {isBetting && "READY"}
                {isPlayerTurn && `TURN / ${currentHand.toUpperCase()}`}
                {stage === "dealer-turn" && "DEALER TURN"}
                {isDone && "COMPLETE"}
              </span>
            </div>
          </div>

          {/* Game area */}
          <div
            className="
              flex
              flex-1
              flex-col
              justify-between
              py-8
              sm:py-10
            "
          >
            {/* Dealer */}
            <div className="flex flex-col items-center">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="
                    text-[10px]
                    font-mono
                    uppercase
                    tracking-[0.18em]
                    text-zinc-600
                  "
                >
                  Dealer
                </span>

                {dealerValue > 0 && (
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {dealerValue}
                  </span>
                )}
              </div>

              <div
                className="
                  flex
                  min-h-[112px]
                  items-center
                  justify-center
                  -space-x-8
                  sm:min-h-[144px]
                  sm:-space-x-10
                "
              >
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
            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-900" />

              <span
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.2em]
                  text-zinc-700
                "
              >
                vs
              </span>

              <div className="h-px flex-1 bg-zinc-900" />
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
                    <div className="mb-4 flex items-center gap-3">
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

                    <div className="mb-3 h-1 w-12 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`
                          h-full
                          transition-all
                          ${isLeftHandActive ? "w-full bg-emerald-400" : "w-0"}
                        `}
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
                <div className="mb-4 flex items-center gap-3">
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

                <div className="mb-3 h-1 w-14 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`
                      h-full
                      transition-all
                      duration-300
                      ${isRightHandActive ? "w-full bg-emerald-400" : "w-0"}
                    `}
                  />
                </div>

                <div
                  className="
                    flex
                    min-h-[112px]
                    items-center
                    justify-center
                    -space-x-8
                    sm:min-h-[144px]
                    sm:-space-x-10
                  "
                >
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
                        flex
                        h-28
                        w-20
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        border-zinc-800
                        sm:h-36
                        sm:w-24
                      "
                    >
                      <span
                        className="
                          text-[9px]
                          font-mono
                          uppercase
                          tracking-widest
                          text-zinc-700
                        "
                      >
                        Awaiting Bet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-zinc-800/70 pt-5">
            {isDone && (
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="
                    rounded-lg
                    bg-emerald-400
                    px-7
                    py-2.5
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-zinc-950
                    transition
                    active:scale-95
                    hover:brightness-110
                  "
                >
                  New Hand
                </button>
              </div>
            )}

            {isBetting && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <button
                  onClick={() => {
                    handleAction(actions.deal({ bet }));
                    setChips((prev) => prev - bet);
                  }}
                  disabled={bet === 0 || bet > chips}
                  className="
                    order-2
                    rounded-lg
                    bg-emerald-400
                    px-7
                    py-2.5
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-zinc-950
                    transition
                    active:scale-95
                    disabled:pointer-events-none
                    disabled:opacity-30
                    hover:brightness-110
                    sm:order-1
                  "
                >
                  Deal
                  {bet > 0 ? ` · ${bet}€` : ""}
                </button>

                <div
                  className="
                    order-1
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-950/70
                    p-1
                    sm:order-2
                  "
                >
                  {[5, 20, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBet((prev) => prev + amount)}
                      disabled={bet + amount > chips}
                      className="
                        rounded-md
                        px-3
                        py-1.5
                        font-mono
                        text-xs
                        text-zinc-400
                        transition
                        disabled:pointer-events-none
                        disabled:opacity-30
                        hover:bg-zinc-900
                        hover:text-emerald-400
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
                        font-mono
                        text-[10px]
                        uppercase
                        text-zinc-600
                        transition
                        hover:text-rose-400
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
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-5
                    py-2.5
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-200
                    transition
                    active:scale-95
                    hover:border-zinc-600
                    hover:text-white
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
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-5
                    py-2.5
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-200
                    transition
                    active:scale-95
                    hover:border-zinc-600
                    hover:text-white
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
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-5
                    py-2.5
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-200
                    transition
                    active:scale-95
                    disabled:pointer-events-none
                    disabled:opacity-25
                    hover:border-zinc-600
                    hover:text-white
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
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-5
                    py-2.5
                    font-mono
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-200
                    transition
                    active:scale-95
                    disabled:pointer-events-none
                    disabled:opacity-25
                    hover:border-zinc-600
                    hover:text-white
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
                    rounded-lg
                    border
                    border-emerald-500/35
                    bg-emerald-500/[0.07]
                    px-5
                    py-2.5
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-400
                    transition
                    active:scale-95
                    hover:border-emerald-400/60
                    hover:bg-emerald-500/[0.12]
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
