// Данные для квиза - вопросы и ответы
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
    }
];

let currentQuestion = 0;
let score = 0;

// Простые звуки без файлов (Web Audio API)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Нота C
        } else if (type === 'wrong') {
            oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // Нота F
        } else {
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Нота A
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log("Звуки не поддерживаются:", e);
    }
}

// Функция для загрузки вопроса
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const progressElement = document.getElementById('progress');
    
    if (!questionElement || !answersElement || !progressElement) {
        console.error("Элементы не найдены!");
        return;
    }
    
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
            playSound('click');
            selectAnswer(index);
        };
        answersElement.appendChild(button);
    });
    
    // Обновляем прогресс-бар
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressElement.style.width = `${progress}%`;
}

// Функция выбора ответа
function selectAnswer(selectedIndex) {
    const correctIndex = quizData[currentQuestion].correct;
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    
    if (!nextButton) {
        console.error("Кнопка 'Следующий' не найдена!");
        return;
    }
    
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
    
    // Воспроизводим звук и увеличиваем счёт
    if (selectedIndex === correctIndex) {
        playSound('correct');
        score++;
    } else {
        playSound('wrong');
    }
    
    // Показываем кнопку "Следующий вопрос"
    nextButton.classList.remove('hidden');
}

// Функция перехода к следующему вопросу
function nextQuestion() {
    playSound('click');
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
        document.getElementById('next-btn').classList.add('hidden');
    } else {
        // Квиз завершен, переходим на страницу результатов
        saveToLocalStorage('quizScore', score);
        saveToLocalStorage('totalQuestions', quizData.length);
        window.location.href = 'result.html';
    }
}

// Загружаем первый вопрос когда страница загрузится
document.addEventListener('DOMContentLoaded', loadQuestion);
