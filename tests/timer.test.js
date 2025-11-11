// tests/timer.test.js

// Importation de la classe ToothbrushTimer depuis timer.js
// Note : Pour que cela fonctionne, il faut que timer.js utilise `module.exports`.
// Ajoute cette ligne à la fin de timer.js : `module.exports = ToothbrushTimer;`
const ToothbrushTimer = require('../js/timer');

// Mock du DOM pour Jest
beforeEach(() => {
  // Réinitialise le DOM avant chaque test
  document.body.innerHTML = `
    <span id="timer">2:00</span>
    <button id="start-button"></button>
    <div id="rewards-display" style="display: none;"></div>
  `;

  // Mock des fonctions de timer (setInterval, clearInterval)
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');
  jest.spyOn(global, 'clearInterval');
});

afterEach(() => {
  // Nettoie les mocks après chaque test
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe('ToothbrushTimer', () => {
  let timer;

  beforeEach(() => {
    // Crée une nouvelle instance de ToothbrushTimer avant chaque test
    timer = new ToothbrushTimer();
  });

  test('1. L\'initialisation définit le temps à 120 secondes', () => {
    expect(timer.timeLeft).toBe(120);
  });

  test('2. La méthode update() décrémente le temps', () => {
    timer.timeLeft = 10;
    timer.update();
    expect(timer.timeLeft).toBe(9);
  });

  test('3. La méthode end() est appelée quand timeLeft atteint 0', () => {
    // Espionne la méthode end()
    const endSpy = jest.spyOn(timer, 'end');

    // Simule timeLeft = 1, puis appelle update()
    timer.timeLeft = 1;
    timer.update();

    // Vérifie que end() a été appelée
    expect(endSpy).toHaveBeenCalledTimes(1);
  });

  test('4. La méthode end() nettoie l\'intervalle', () => {
    timer.timerInterval = 123; // Simule un ID d'intervalle
    timer.end();
    expect(global.clearInterval).toHaveBeenCalledWith(123);
  });

  test('5. Le timer démarre correctement', () => {
    timer.start();
    expect(global.setInterval).toHaveBeenCalled();
    expect(timer.timerInterval).not.toBeNull();
  });
});

