// js/timer.js

// TODO: [LLM] Ajouter un système de logs plus robuste (par ex. pour les secours).

class ToothbrushTimer {
    constructor() {
        this.initialTime = 120; // 2 minutes
        this.timeLeft = this.initialTime;
        this.timerInterval = null;

        this.startButton = document.getElementById("start-button");
        this.timerElement = document.getElementById("timer");
        this.rewardsDisplay = document.getElementById("rewards-display");

        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.start());
        }
        this.log("Timer initialisé avec succès.");
    }

    log(message) {
        console.log(`[ToothbrushTimer] ${message}`);
        // TODO: [LLM] Sauvegarder les logs dans un fichier local pour le secours.
    }

    start() {
        if (this.timerInterval) return; // Empêche le double démarrage

        if (this.startButton) this.startButton.style.display = 'none';
        this.updateDisplay();
        this.timerInterval = setInterval(() => this.update(), 1000);
        this.log("Timer démarré.");

        // TODO: [LLM] Initialiser les animations des bulles et bactéries.
    }

    update() {
        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft <= 0) {
            this.end();
        }
    }

    end() {
        if (!this.timerInterval) return; // S'assurer qu'il était en cours
        clearInterval(this.timerInterval);
        this.timerInterval = null; // Important pour les tests
        this.timeLeft = 0;
        this.updateDisplay();
        this.triggerRewards();
        this.log("Brossage terminé. Récompenses déclenchées.");

        // TODO: [LLM] Sauvegarder le score dans le localStorage.
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerElement.textContent = 
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    triggerRewards() {
        if (this.rewardsDisplay) {
            this.rewardsDisplay.style.display = 'block';
        }
        // TODO: [LLM] Implémenter l'affichage des badges/scores/sons.
    }
} // <-- Fermeture de la classe ToothbrushTimer

document.addEventListener('DOMContentLoaded', () => {
    new ToothbrushTimer();
});

// LIGNE CRITIQUE POUR LES TESTS JEST :
module.exports = ToothbrushTimer;

