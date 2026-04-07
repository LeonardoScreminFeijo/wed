import confetti from "canvas-confetti";

export function dispararConfetes() {
  const count = 350;

  // Cores: Vinho, Laranja, Dourado e Branco
  const defaults = {
    origin: { y: 1 },
    colors: ["#7A1B2A", "#E36944", "#F4C430", "#FFFFFF"],
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    );
  }

  fire(0.25, { spread: 60, startVelocity: 55 });
  fire(0.2, { spread: 70 });
  fire(0.35, { spread: 110, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 130, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 130, startVelocity: 45 });
}
