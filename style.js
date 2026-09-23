let tasks = JSON.parse(localStorage.getItem('anime-tasks')) || [];

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoGrid = document.getElementById('todo-grid');

function renderTasks() {
    todoGrid.innerHTML = '';
    tasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.className = `todo-card ${task.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <p onclick="toggleTask(${index})" style="cursor:pointer;" title="Click to toggle completed">${task.completed ? '💖 ' : '☐ '} ${task.text}</p>
            <button class="delete-btn" onclick="deleteTask(${index})">🌸</button>
        `;
        todoGrid.appendChild(card);
    });
    localStorage.setItem('anime-tasks', JSON.stringify(tasks));
    
    const taskCountBadge = document.getElementById('task-count-badge');
    if (taskCountBadge) {
        taskCountBadge.textContent = `${tasks.length} ${tasks.length === 1 ? 'Task' : 'Tasks'}`;
    }
}

window.toggleTask = function(index) {
    if (tasks[index]) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }
}

addTodoBtn.addEventListener('click', () => {
    if (todoInput.value.trim() === '') return;
    tasks.push({ text: todoInput.value, completed: false });
    todoInput.value = '';
    renderTasks();
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodoBtn.click();
    }
});

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
}

renderTasks();

const playlist = [
    {
        title: "Chill Study Session",
        artist: "Lofi Ambient",
        url: "https://archive.org/download/lofi-study-beats-royalty-free/chill-lofi.mp3"
    },
    {
        title: "Rainy Cafe Day",
        artist: "Tokyo Coffee Shop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Soft Strawberry Dreams",
        artist: "Kawaii Lofi Beats",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
];

let trackIndex = 0;
let isPlaying = false;

const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const musicIcon = document.querySelector('.music-icon');

function loadTrack(track) {
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    audio.src = track.url;
}

function playTrack() {
    isPlaying = true;
    audio.play().catch(() => {});
    playBtn.textContent = '⏸️';
    if (musicIcon) musicIcon.classList.add('playing');
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.textContent = '▶️';
    if (musicIcon) musicIcon.classList.remove('playing');
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

nextBtn.addEventListener('click', () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    loadTrack(playlist[trackIndex]);
    playTrack();
});

prevBtn.addEventListener('click', () => {
    trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(playlist[trackIndex]);
    playTrack();
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;

        const curMin = Math.floor(audio.currentTime / 60);
        const curSec = Math.floor(audio.currentTime % 60);
        const durMin = Math.floor(audio.duration / 60);
        const durSec = Math.floor(audio.duration % 60);
        const curTimeText = document.getElementById('current-time-text');
        const durTimeText = document.getElementById('duration-time-text');
        if (curTimeText) curTimeText.textContent = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;
        if (durTimeText) durTimeText.textContent = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
    }
});

progressBar.addEventListener('input', () => {
    if (audio.duration) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

audio.addEventListener('ended', () => {
    nextBtn.click();
});

loadTrack(playlist[trackIndex]);
audio.volume = volumeSlider.value / 100;

function updateLiveClock() {
    const now = new Date();
    const dateElem = document.getElementById('live-date');
    const timeElem = document.getElementById('live-time');
    
    if (dateElem && timeElem) {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        dateElem.textContent = now.toLocaleDateString('en-US', options);
        timeElem.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

const timerDisplay = document.getElementById('timer-display');
const timerBtn = document.getElementById('timer-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerProgressRing = document.getElementById('timer-progress-ring');
const timerModeLabel = document.getElementById('timer-mode-label');
const modePills = document.querySelectorAll('.mode-pill');

let totalTime = 1500;
let timeRemaining = 1500;
let timerInterval = null;
let isTimerRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timerDisplay) timerDisplay.textContent = formatted;

    if (timerProgressRing) {
        const circumference = 326.7;
        const offset = circumference - (timeRemaining / totalTime) * circumference;
        timerProgressRing.style.strokeDashoffset = offset;
    }
}

function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    if (timerBtn) timerBtn.textContent = 'Pause';

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            if (timerBtn) timerBtn.textContent = 'Start';
            alert('🎉 Yay! Study session completed! Take a soft break 🌸');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (timerBtn) timerBtn.textContent = 'Start';
}

if (timerBtn) {
    timerBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
}

if (timerResetBtn) {
    timerResetBtn.addEventListener('click', () => {
        pauseTimer();
        timeRemaining = totalTime;
        updateTimerDisplay();
    });
}

modePills.forEach(pill => {
    pill.addEventListener('click', () => {
        modePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        totalTime = parseInt(pill.getAttribute('data-time'), 10);
        timeRemaining = totalTime;
        const labelText = pill.getAttribute('data-label');
        if (timerModeLabel) timerModeLabel.textContent = labelText;

        pauseTimer();
        updateTimerDisplay();
    });
});

updateTimerDisplay();

const musicNotesBox = document.getElementById('music-notes-box');
const notesList = ['🎵', '🎶', '🎼', '💖', '✨'];

setInterval(() => {
    if (isPlaying && musicNotesBox) {
        const note = document.createElement('span');
        note.className = 'floating-note';
        note.textContent = notesList[Math.floor(Math.random() * notesList.length)];
        note.style.left = `${Math.random() * 80}%`;
        musicNotesBox.appendChild(note);

        setTimeout(() => {
            note.remove();
        }, 2200);
    }
}, 700);

const moodButtons = document.querySelectorAll('.mood-btn');
const moodStatusText = document.getElementById('mood-status-text');
const savedMood = localStorage.getItem('kawaii-study-mood');

if (savedMood && moodStatusText) {
    moodStatusText.textContent = `Today's Mood: ${savedMood} ✨`;
    moodButtons.forEach(btn => {
        if (btn.getAttribute('data-mood') === savedMood) {
            btn.classList.add('selected');
        }
    });
}

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const chosenMood = btn.getAttribute('data-mood');
        localStorage.setItem('kawaii-study-mood', chosenMood);
        if (moodStatusText) {
            moodStatusText.textContent = `Today's Mood: ${chosenMood} ✨`;
        }
    });
});

const scheduleInputs = document.querySelectorAll('.schedule-input');
const savedSchedule = JSON.parse(localStorage.getItem('kawaii-study-schedule')) || {};

scheduleInputs.forEach(input => {
    const timeKey = input.getAttribute('data-time');
    if (savedSchedule[timeKey]) {
        input.value = savedSchedule[timeKey];
    }
    input.addEventListener('input', () => {
        savedSchedule[timeKey] = input.value;
        localStorage.setItem('kawaii-study-schedule', JSON.stringify(savedSchedule));
    });
});

const studyNotesArea = document.getElementById('study-notes-area');
if (studyNotesArea) {
    const savedNotes = localStorage.getItem('kawaii-study-notes');
    if (savedNotes) {
        studyNotesArea.value = savedNotes;
    }
    studyNotesArea.addEventListener('input', () => {
        localStorage.setItem('kawaii-study-notes', studyNotesArea.value);
    });
}

const kawaiiQuotes = [
    "\"Small progress every day adds up to big results! 🌸\"",
    "\"Believe in yourself and study softly. You've got this! ✨\"",
    "\"Dream big, work hard, stay focused and stay cute! 🍓\"",
    "\"Every minute you study brings you closer to your goals! 🎀\"",
    "\"Take breaks, drink tea, and sparkle on! 🧸\""
];

const dailyQuoteText = document.getElementById('daily-quote-text');
const refreshQuoteBtn = document.getElementById('refresh-quote-btn');

function setRandomQuote() {
    if (dailyQuoteText) {
        const randomIndex = Math.floor(Math.random() * kawaiiQuotes.length);
        dailyQuoteText.textContent = kawaiiQuotes[randomIndex];
    }
}

if (refreshQuoteBtn) {
    refreshQuoteBtn.addEventListener('click', setRandomQuote);
}