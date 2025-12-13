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
    
    // Возобновляем контекст (это даст разрешение на воспроизведение)
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Аудио разблокировано!');
            isAudioUnlocked = true;
        });
    }
}

// Модифицируем функцию воспроизведения звука
function playSound(soundName) {
    try {
        const sound = sounds[soundName];
        if (sound) {
            // Разблокируем аудио при первой попытке воспроизведения
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

// Обновляем инициализацию
function initSounds() {
    try {
        // Создаем AudioContext для лучшего контроля
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

// Функция для остановки звука
function stopSound(soundName) {
    try {
        const sound = sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    } catch (error) {
        console.error('Ошибка при остановке звука:', error);
    }
}

// Функция для настройки громкости конкретного звука
function setSoundVolume(soundName, volume) {
    try {
        const sound = sounds[soundName];
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume));
        }
    } catch (error) {
        console.error('Ошибка при настройке громкости:', error);
    }
}

// Функция для проверки поддержки аудио браузером
function isAudioSupported() {
    return typeof Audio !== 'undefined';
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
    // Воспроизводим соответствующий звук
    if (type === 'success') {
        playSound('correct');
    } else if (type === 'error') {
        playSound('wrong');
    } else {
        playSound('click');
    }
    
    // Создаем элемент для сообщения
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
    `;
    
    // Разные цвета для разных типов сообщений
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#2d5a2d';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#5a2d2d';
        messageDiv.style.color = 'white';
    } else {
        messageDiv.style.backgroundColor = '#b29700';
        messageDiv.style.color = '#1a1a1a';
    }
    
    // Добавляем сообщение на страницу
    document.body.appendChild(messageDiv);
    
    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        messageDiv.remove();
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

// Функция для сохранения результатов в localStorage
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

// Функция для загрузки данных из localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return null;
    }
}

// Функция для озвучивания кликов по кнопкам
function setupButtonSounds() {
    document.addEventListener('DOMContentLoaded', () => {
        const interactiveElements = document.querySelectorAll(
            'button, a[href], input[type="submit"], input[type="button"]'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('data-sound-bound')) {
                element.addEventListener('click', (e) => {
                    if (!element.disabled) {
                        playSound('click');
                    }
                });
                element.setAttribute('data-sound-bound', 'true');
            }
        });
    });
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

// Автоматическая инициализация звуков при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (isAudioSupported()) {
        initSounds();
        setupButtonSounds();
        updateNav();
    } else {
        console.warn('Браузер не поддерживает аудио API');
    }
    
    // Разблокируем аудио при клике
    document.addEventListener('click', unlockAudio);
});

// Экспортируем функции для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        playSound,
        stopSound,
        setSoundVolume,
        initSounds,
        sounds,
        startQuiz,
        chooseQuest,
        showMessage,
        validateForm,
        saveToLocalStorage,
        loadFromLocalStorage,
        setupButtonSounds,
        isAudioSupported,
        updateNav
    };
}
