import React from "react";
import Die from "./components/Die.jsx";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

/* -------------------------
   UTILITIES
------------------------- */
function generateAllNewDice() {
  return Array.from({ length: 10 }, () => ({
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
    id: nanoid(),
    isRolling: false,
  }));
}

/* -------------------------
   APP
------------------------- */
export default function App() {
  const { width, height } = useWindowSize();

  const [dice, setDice] = React.useState(generateAllNewDice);
  const [gameWon, setGameWon] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const buttonRef = React.useRef(null);

  /* -------------------------
     CONFETTI CONTROL
  ------------------------- */
  React.useEffect(() => {
    if (!gameWon) return;

    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => clearTimeout(timer);
  }, [gameWon]);

  /* -------------------------
     WIN CHECK
  ------------------------- */
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const sameValue = dice.every(die => die.value === dice[0].value);

    if (allHeld && sameValue && !gameWon) {
      setGameWon(true);
      buttonRef.current?.focus();
    }
  }, [dice, gameWon]);

  /* -------------------------
     ACTIONS
  ------------------------- */
  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice());
      setGameWon(false);
      return;
    }

    setDice(prevDice =>
      prevDice.map(die =>
        die.isHeld
          ? die
          : {
              ...die,
              value: Math.ceil(Math.random() * 6),
              isRolling: true,
            }
      )
    );

    setTimeout(() => {
      setDice(oldDice =>
        oldDice.map(die => ({ ...die, isRolling: false }))
      );
    }, 350);
  }

  function hold(id) {
    setDice(prevDice =>
      prevDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  /* -------------------------
     RENDER
  ------------------------- */
  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      held={die.isHeld}
      roll={die.isRolling}
      handleClick={() => hold(die.id)}
    />
  ));

  return (
    <main className={`main ${gameWon ? "win" : ""}`}>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          gravity={0.3}
          recycle={false}
          tweenDuration={1500}
          colors={["#59E391", "#7EF3B6", "#5035FF", "#FFD166"]}
          style={{ pointerEvents: "none" }}
        />
      )}

      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>
            Congratulations! You won! Press “New Game” to start again.
          </p>
        )}
      </div>

      <h1 className="title">Tenzies</h1>

      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <section className="container" role="grid">
        {diceElements}
      </section>

      <button
        ref={buttonRef}
        onClick={rollDice}
        className="roll-btn"
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
