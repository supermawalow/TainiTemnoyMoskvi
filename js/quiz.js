// ================================
// СИСТЕМА ЗВУКОВ ДЛЯ КВИЗА
// ================================

// Инициализация звуков для квиза
const quizSounds = {
    correct: new Audio('sounds/correct.mp3'),
    click: new Audio('sounds/click.mp3'),
    wrong: new Audio('sounds/wrong.mp3'),
    next: new Audio('sounds/click.mp3') // Можно заменить на другой звук
};

// Флаг для отслеживания инициализации звуков
let soundsInitialized = false;

// Инициализация звуков для квиза
function initQuizSounds() {
    if (soundsInitialized) return;
    
    try {
        // Настройка громкости
        quizSounds.correct.volume = 0.7;
        quizSounds.click.volume = 1;
        quizSounds.wrong.volume = 0.3;
        quizSounds.next.volume = 0.5;
        
        // Предзагрузка звуков
        Object.values(quizSounds).forEach(sound => {
            sound.load().catch(e => console.log('Предзагрузка звука:', e));
        });
        
        soundsInitialized = true;
        console.log('Звуки квиза инициализированы');
    } catch (error) {
        console.error('Ошибка инициализации звуков квиза:', error);
    }
}

// Воспроизведение звуков в квизе
function playQuizSound(soundName) {
    try {
        const sound = quizSounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Если ошибка автовоспроизведения, инициализируем по первому клику
                if (e.name === 'NotAllowedError') {
                    enableQuizSoundsOnInteraction();
                }
            });
        }
    } catch (error) {
        console.warn('Ошибка воспроизведения звука:', error);
    }
}

// Активация звуков по первому взаимодействию
function enableQuizSoundsOnInteraction() {
    const enableOnce = () => {
        initQuizSounds();
        // Удаляем обработчики после активации
        document.removeEventListener('click', enableOnce);
        document.removeEventListener('keydown', enableOnce);
        document.removeEventListener('touchstart', enableOnce);
    };
    
    document.addEventListener('click', enableOnce);
    document.addEventListener('keydown', enableOnce);
    document.addEventListener('touchstart', enableOnce);
}

// ================================
// ДАННЫЕ ДЛЯ КВИЗА
// ================================

const quizData = [
    {
        question: "В каком московском метро по легенде обитает призрак 'Чёрного монаха'?",
        answers: [
            "Сокольники",
            "Библиотека имени Ленина", 
            "Киевская",
            "Парк Культуры"
        ],
        correct: 1
    },
    {
        question: "Какое здание в Москве называют 'Домом самоубийц'?",
        answers: [
            "Сталинская высотка на Кудринской",
            "Дом на набережной",
            "Здание МГУ",
            "Храм Христа Спасителя"
        ],
        correct: 0
    },
    {
        question: "Где по легенде можно встретить призрак 'Белой пианистки'?",
        answers: [
            "В Консерватории",
            "В Останкинской башне",
            "В Цирке на Цветном бульваре", 
            "В Большом театре"
        ],
        correct: 3
    },
    {
        question: "Какой московский театр считается самым проклятым?",
        answers: [
            "Большой театр",
            "Театр на Таганке", 
            "Ленком",
            "Театр Вахтангова"
        ],
        correct: 1
    },
    {
        question: "Где по легенде спрятана библиотека Ивана Грозного?",
        answers: [
            "В Кремле",
            "Под Зачатьевским монастырём",
            "На Воробьёвых горах",
            "В Коломенском"
        ],
        correct: 3
    },
    {
        question: "Какой мост в Москве считается 'Мостом самоубийц'?",
        answers: [
            "Крымский мост",
            "Большой Каменный мост", 
            "Патриарший мост",
            "Новоарбатский мост"
        ],
        correct: 2
    },
    {
        question: "В каком районе Москвы чаще всего видят призрак 'Чёрной кошки'?",
        answers: [
            "Арбат",
            "Китай-город", 
            "Останкино",
            "Люблино"
        ],
        correct: 0
    },
    {
        question: "Какую станцию метро называют 'Вратами ада'?",
        answers: [
            "Площадь Революции",
            "Новослободская", 
            "Маяковская",
            "Комсомольская"
        ],
        correct: 1
    },
    {
        question: "Где в Москве находится 'Дом с привидениями' на Мясницкой?",
        answers: [
            "Дом 13",
            "Дом 17", 
            "Дом 21",
            "Дом 7"
        ],
        correct: 2
    },
    {
        question: "Какой монастырь в Москве считается самым мистическим?",
        answers: [
            "Новодевичий монастырь",
            "Донской монастырь", 
            "Зачатьевский монастырь",
            "Свято-Данилов монастырь"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let answerSelected = false;

// ================================
// ОСНОВНЫЕ ФУНКЦИИ КВИЗА
// ================================

// Загрузка вопроса
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const progressElement = document.getElementById('progress');
    const nextButton = document.getElementById('next-btn');
    
    // Сбрасываем состояние
    answerSelected = false;
    nextButton.classList.add('hidden');
    
    // Показываем текущий вопрос
    questionElement.textContent = quizData[currentQuestion].question;
    
    // Очищаем предыдущие ответы
    answersElement.innerHTML = '';
    
    // Добавляем варианты ответов
    quizData[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.className = 'answer-btn';
        button.onclick = () => {
            if (!answerSelected) {
                selectAnswer(index);
            }
        };
        answersElement.appendChild(button);
    });
    
    // Обновляем прогресс-бар
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressElement.style.width = `${progress}%`;
    
    // Обновляем текст на кнопке
    if (currentQuestion === quizData.length - 1) {
        nextButton.textContent = '✨ Узнать результат';
    } else {
        nextButton.textContent = '➡️ Следующий вопрос';
    }
}

// Выбор ответа
function selectAnswer(selectedIndex) {
    answerSelected = true;
    
    const correctIndex = quizData[currentQuestion].correct;
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    
    // Воспроизводим звук клика при выборе ответа
    playQuizSound('click');
    
    // Отключаем все кнопки
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Подсвечиваем правильный и неправильный ответ
    answerButtons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            button.classList.add('wrong');
        }
    });
    
    // Обработка правильного/неправильного ответа
    if (selectedIndex === correctIndex) {
        score++;
        // Звук правильного ответа с задержкой
        setTimeout(() => playQuizSound('correct'), 300);
        
        // Анимация для правильного ответа (опционально)
        answerButtons[selectedIndex].style.animation = 'pulseCorrect 0.5s';
    } else {
        // Звук неправильного ответа с задержкой
        setTimeout(() => playQuizSound('wrong'), 300);
        
        // Анимация для неправильного ответа (опционально)
        answerButtons[selectedIndex].style.animation = 'shakeWrong 0.5s';
    }
    
    // Показываем кнопку "Следующий вопрос"
    setTimeout(() => {
        nextButton.classList.remove('hidden');
    }, 500);
}

// Переход к следующему вопросу
function nextQuestion() {
    // Звук при нажатии кнопки "Далее"
    playQuizSound('next');
    
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        setTimeout(() => loadQuestion(), 200); // Небольшая задержка для плавности
    } else {
        // Сохраняем результаты и переходим на страницу результатов
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage('quizScore', score);
            saveToLocalStorage('totalQuestions', quizData.length);
        } else {
            // Резервное сохранение
            localStorage.setItem('quizScore', score);
            localStorage.setItem('totalQuestions', quizData.length);
        }
        
        // Задержка перед переходом для воспроизведения звука
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 300);
    }
}

// ================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем звуки для квиза
    initQuizSounds();
    enableQuizSoundsOnInteraction();
    
    // Загружаем первый вопрос
    loadQuestion();
    
    // Добавляем звук клика к кнопке "Следующий вопрос"
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.addEventListener('click', () => playQuizSound('click'));
    }
    
    // Добавляем CSS анимации для ответов (опционально)
    if (!document.querySelector('#quiz-animations')) {
        const style = document.createElement('style');
        style.id = 'quiz-animations';
        style.textContent = `
            @keyframes pulseCorrect {
                0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
            }
            @keyframes shakeWrong {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .correct {
                animation: pulseCorrect 1.5s infinite !important;
            }
        `;
        document.head.appendChild(style);
    }
});