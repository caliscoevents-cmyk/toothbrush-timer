module.exports = {
  // Indique à Jest où trouver les fichiers de test
  // Il va maintenant chercher dans le dossier 'tests'
  testMatch: [
    "**/tests/**/*.test.js"
  ],
  // Utilisation de l'environnement JSDOM pour simuler un navigateur 
  // (nécessaire pour le JS de frontend que vous avez dans timer.js)
  testEnvironment: 'jsdom' 
};
