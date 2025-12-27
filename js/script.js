// Общие функции для всего сайта

// Инициализация звуков
const sounds = {
    correct: new Audio('sounds/correct.mp3'),
    click: new Audio('sounds/click.mp3'),
    wrong: new Audio('sounds/wrong.mp3')
};

let audioContext = null;
let isAudioUnlocked = false;

// Функция разблокировки аудио
function unlockAudio() {
    if (isAudioUnlocked || !audioContext) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Аудио разблокировано!');
            isAudioUnlocked = true;
        });
    }
}

// Функция воспроизведения звука
function playSound(soundName) {
    try {
        const sound = sounds[soundName];
        if (sound) {
            if (!isAudioUnlocked) {
                unlockAudio();
            }
            
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn('Ошибка воспроизведения звука:', error);
            });
        } else {
            console.warn(`Звук "${soundName}" не найден`);
        }
    } catch (error) {
        console.error('Ошибка при воспроизведении звука:', error);
    }
}

// Инициализация звуков
function initSounds() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        sounds.correct.volume = 1;
        sounds.click.volume = 1;
        sounds.wrong.volume = 0.3;
        
        console.log('Звуки успешно инициализированы');
    } catch (error) {
        console.error('Ошибка инициализации звуков:', error);
    }
}

// ГЛОБАЛЬНАЯ ФОНОВАЯ МУЗЫКА
let backgroundMusic = null;
let isMusicPlaying = false;
let musicVolume = 0.3; // Громкость 30%

// Инициализация музыки
function initBackgroundMusic() {
    if (backgroundMusic) return;
    
    try {
        backgroundMusic = new Audio('sounds/ambient.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = musicVolume;
        backgroundMusic.preload = 'auto';
        
        console.log('🎵 Фоновая музыка инициализирована');
        
        // Пытаемся включить музыку автоматически
        setTimeout(() => {
            if (!isMusicPlaying) {
                backgroundMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicButton();
                    console.log('🎵 Музыка автоматически включена');
                }).catch(e => {
                    console.log('🎵 Автовоспроизведение заблокировано, ждём клика пользователя');
                });
            }
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка загрузки музыки:', error);
    }
}

// Переключение музыки
function toggleBackgroundMusic() {
    if (!backgroundMusic) {
        initBackgroundMusic();
        return;
    }
    
    playSound('click'); // Звук клика
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        showMessage('🔇 Музыка выключена', 'info');
    } else {
        backgroundMusic.play().catch(e => {
            showMessage('🎵 Нажми ещё раз для включения', 'info');
            return;
        });
        isMusicPlaying = true;
        showMessage('🎵 Фоновая музыка включена', 'success');
    }
    
    updateMusicButton();
    saveMusicState();
}

// Обновление кнопки музыки
function updateMusicButton() {
    const musicButton = document.getElementById('music-toggle');
    if (musicButton) {
        musicButton.textContent = isMusicPlaying ? '🔊' : '🔇';
        musicButton.title = isMusicPlaying ? 'Выключить музыку' : 'Включить музыку';
    }
}

// Сохранение состояния музыки
function saveMusicState() {
    localStorage.setItem('musicState', JSON.stringify({
        isPlaying: isMusicPlaying,
        volume: musicVolume
    }));
}

// Загрузка состояния музыки
function loadMusicState() {
    try {
        const saved = JSON.parse(localStorage.getItem('musicState'));
        if (saved) {
            isMusicPlaying = saved.isPlaying;
            musicVolume = saved.volume || 0.3;
            
            // Обновляем громкость, если музыка уже загружена
            if (backgroundMusic) {
                backgroundMusic.volume = musicVolume;
            }
        }
    } catch (e) {
        console.log('Не удалось загрузить состояние музыки');
    }
}

// Изменение громкости
function changeMusicVolume(newVolume) {
    if (!backgroundMusic) return;
    
    musicVolume = Math.max(0, Math.min(1, newVolume));
    backgroundMusic.volume = musicVolume;
    
    // Обновляем ползунок громкости
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.value = musicVolume * 100;
    }
    
    saveMusicState();
}

// Создание кнопки управления музыкой
function createMusicControl() {
    // Проверяем, не создана ли уже кнопка
    if (document.getElementById('music-toggle')) return;
    
    const musicButton = document.createElement('button');
    musicButton.id = 'music-toggle';
    musicButton.className = 'music-control';
    musicButton.onclick = toggleBackgroundMusic;
    musicButton.title = 'Включить/выключить музыку';
    
    document.body.appendChild(musicButton);
    
    // Создаем ползунок громкости
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = musicVolume * 100;
    volumeSlider.id = 'volume-slider';
    volumeSlider.className = 'volume-slider';
    volumeSlider.title = 'Громкость';
    
    volumeSlider.addEventListener('input', function() {
        changeMusicVolume(this.value / 100);
    });
    
    document.body.appendChild(volumeSlider);
    
    // Показываем ползунок при наведении на кнопку
    musicButton.addEventListener('mouseenter', function() {
        volumeSlider.style.opacity = '1';
        volumeSlider.style.pointerEvents = 'auto';
    });
    
    musicButton.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!volumeSlider.matches(':hover')) {
                volumeSlider.style.opacity = '0';
                volumeSlider.style.pointerEvents = 'none';
            }
        }, 300);
    });
    
    volumeSlider.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!musicButton.matches(':hover')) {
                volumeSlider.style.opacity = '0';
                volumeSlider.style.pointerEvents = 'none';
            }
        }, 300);
    });
    
    // Скрываем ползунок по умолчанию
    volumeSlider.style.opacity = '0';
    volumeSlider.style.pointerEvents = 'none';
    
    // Загружаем состояние и обновляем кнопку
    loadMusicState();
    updateMusicButton();
    
    // Если музыка должна играть, запускаем её
    if (isMusicPlaying && backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(e => {
            console.log('Ожидаем взаимодействия пользователя для воспроизведения музыки');
        });
    }
}

// Функция для перехода к выбору квеста
function chooseQuest() {
    playSound('click');
    setTimeout(() => {
        window.location.href = 'quests.html';
    }, 100);
}

// Функция для начала квиза
function startQuiz() {
    playSound('click');
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 100);
}

// Функция для показа уведомлений
function showMessage(message, type = 'info') {
    if (type === 'success') {
        playSound('correct');
    } else if (type === 'error') {
        playSound('wrong');
    } else {
        playSound('click');
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        max-width: 300px;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(45, 90, 45, 0.9)';
        messageDiv.style.color = 'white';
        messageDiv.style.border = '1px solid rgba(0, 255, 0, 0.3)';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = 'rgba(90, 45, 45, 0.9)';
        messageDiv.style.color = 'white';
        messageDiv.style.border = '1px solid rgba(255, 0, 0, 0.3)';
    } else {
        messageDiv.style.backgroundColor = 'rgba(178, 151, 0, 0.9)';
        messageDiv.style.color = '#1a1a1a';
        messageDiv.style.border = '1px solid rgba(255, 215, 0, 0.3)';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    }, 3000);
}

// Функция для проверки заполнения формы
function validateForm(formData) {
    for (let key in formData) {
        if (!formData[key] || formData[key].trim() === '') {
            return false;
        }
    }
    return true;
}

// Функция для сохранения в localStorage
function saveToLocalStorage(key, data) {
    try {
        playSound('click');
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        playSound('wrong');
        return false;
    }
}

// Функция для загрузки из localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return null;
    }
}

// Функция для озвучивания кликов
function setupButtonSounds() {
    document.addEventListener('DOMContentLoaded', () => {
        const interactiveElements = document.querySelectorAll(
            'button, a[href], input[type="submit"], input[type="button"]'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('data-sound-bound')) {
                element.addEventListener('click', (e) => {
                    if (!element.disabled && !element.classList.contains('menu-toggle')) {
                        playSound('click');
                    }
                });
                element.setAttribute('data-sound-bound', 'true');
            }
        });
    });
}

// Функция мобильного меню
function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
        nav.classList.toggle('active');
        playSound('click');
    }
}

// Функция для обновления навигации
function updateNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.style.background = 'rgba(255, 255, 255, 0.15)';
            link.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        } else {
            link.style.background = '';
            link.style.borderColor = '';
        }
    });
}

// Пасхалки
let logoClickCount = 0;
let lastLogoClickTime = 0;

function handleLogoClick() {
    const now = Date.now();
    
    if (now - lastLogoClickTime < 1000) {
        logoClickCount++;
    } else {
        logoClickCount = 1;
    }
    
    lastLogoClickTime = now;
    
    if (logoClickCount === 5) {
        showMessage('👻 Секрет активирован! Введи код "1991" где-нибудь на сайте...', 'success');
        playSound('correct');
        logoClickCount = 0;
        
        // Сохраняем в localStorage, что пасхалка найдена
        saveToLocalStorage('easterEggFound', true);
    }
}

// Пасхалка с клавиатурой
let secretCode = '';
const targetCode = '1991';

document.addEventListener('keydown', function(e) {
    // Секретная комбинация: Ctrl+Shift+M
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        showMessage('🎭 Поздравляю! Ты нашёл пасхалку! По легенде, в 3:00 ночи на станции "Библиотека им. Ленина" можно увидеть тень Чёрного Монаха...', 'info');
        playSound('correct');
        
        // Разблокируем секретный достижение
        const achievements = loadFromLocalStorage('achievements') || [];
        if (!achievements.includes('black_monk_secret')) {
            achievements.push('black_monk_secret');
            saveToLocalStorage('achievements', achievements);
        }
    }
    
    // Собираем код "1991"
    if (e.key >= '0' && e.key <= '9') {
        secretCode += e.key;
        
        if (secretCode.length > 4) {
            secretCode = secretCode.slice(-4);
        }
        
        if (secretCode === targetCode) {
            showMessage('🔓 Секретный код принят! 1991... год больших перемен. Говорят, в этом году в Москве открылись порталы в другие миры...', 'success');
            playSound('correct');
            secretCode = '';
            
            // Разблокируем секретное достижение
            const achievements = loadFromLocalStorage('achievements') || [];
            if (!achievements.includes('1991_secret')) {
                achievements.push('1991_secret');
                saveToLocalStorage('achievements', achievements);
            }
        }
    }
});

// Закрывать мобильное меню при клике вне его
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        menuToggle && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
    }
});

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Audio !== 'undefined') {
        initSounds();
        setupButtonSounds();
    } else {
        console.warn('Браузер не поддерживает аудио API');
    }
    
    updateNav();
    
    // Инициализируем фоновую музыку на всех страницах
    initBackgroundMusic();
    createMusicControl();
    
    // Разблокировка аудио при любом клике
    document.addEventListener('click', unlockAudio);
});

// Экспортируем функции
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        playSound,
        startQuiz,
        chooseQuest,
        showMessage,
        validateForm,
        saveToLocalStorage,
        loadFromLocalStorage,
        toggleMenu,
        updateNav
    };
}
