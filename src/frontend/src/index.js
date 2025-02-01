import { startCamera, captureFrame } from './components/video.js';
import { setupGame } from './components/game.js';

document.addEventListener('DOMContentLoaded', () => {
    startCamera();
    setupGame();
});
