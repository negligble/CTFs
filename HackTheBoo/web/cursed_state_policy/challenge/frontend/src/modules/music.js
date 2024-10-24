let audio;
let isPlaying = false;

const initializeAudio = () => {
    if (!audio) {
        audio = new Audio('/static/music/intro.mp3');
        audio.loop = true;
    }
};

const playAudio = () => {
    if (!audio) return;

    audio.play().then(() => {
        document.getElementById('volIcon').textContent = 'volume_up';
        isPlaying = true;
    }).catch(error => {
        console.warn("Audio play was blocked by the browser:", error);
    });
};

const muteAudio = () => {
    if (audio) {
        audio.pause();
        document.getElementById('volIcon').textContent = 'volume_off';
        isPlaying = false;
    }
};

const toggleVol = () => {
    isPlaying ? muteAudio() : playAudio();
};

const handleFirstInteraction = () => {
    initializeAudio();
    document.querySelector('.vol').addEventListener('click', toggleVol);
};

document.addEventListener('DOMContentLoaded', handleFirstInteraction);
