// quiz.js - 10 вопросов, таймер 1:30
console.log("✅ quiz.js загружен - 10 вопросов, таймер 1:30");

// 10 ВОПРОСОВ
const quizData = [
    {
        question: "В каком московском метро по легенде обитает призрак 'Чёрного монаха'?",
        answers: ["Сокольники", "Библиотека имени Ленина", "Киевская", "Парк Культуры"],
        correct: 1
    },
    {
        question: "Какое здание в Москве называют 'Домом самоубийц'?",
        answers: ["Сталинская высотка на Кудринской", "Дом на набережной", "Здание МГУ", "Храм Христа Спасителя"],
        correct: 0
    },
    {
        question: "Где по легенде можно встретить призрак 'Белой пианистки'?",
        answers: ["В Консерватории", "В Останкинской башне", "В Цирке на Цветном бульваре", "В Большом театре"],
        correct: 3
    },
    {
        question: "Какой московский театр считается самым проклятым?",
        answers: ["Большой театр", "Театр на Таганке", "Ленком", "Театр Вахтангова"],
        correct: 1
    },
    {
        question: "Где по легенде спрятана библиотека Ивана Грозного?",
        answers: ["В Кремле", "Под Зачатьевским монастырём", "На Воробьёвых горах", "В Коломенском"],
        correct: 3
    },
    {
        question: "Какой мост в Москве считается 'Мостом самоубийц'?",
        answers: ["Крымский мост", "Большой Каменный мост", "Патриарший мост", "Новоарбатский мост"],
        correct: 2
    },
    {
        question: "В каком районе Москвы чаще всего видят призрак 'Чёрной кошки'?",
        answers: ["Арбат", "Китай-город", "Останкино", "Люблино"],
        correct: 0
    },
    {
        question: "Какую станцию метро называют 'Вратами ада'?",
        answers: ["Площадь Революции", "Новослободская", "Маяковская", "Комсомольская"],
        correct: 1
    },
    {
        question: "Где в Москве находится 'Дом с привидениями' на Мясницкой?",
        answers: ["Дом 13", "Дом 17", "Дом 21", "Дом 7"],
        correct: 2
    },
    {
        question: "Какой монастырь в Москве считается самым мистическим?",
        answers: ["Новодевичий монастырь", "Донской монастырь", "Зачатьевский монастырь", "Свято-Данилов монастырь"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 90; // 1 МИНУТА 30 СЕКУНД = 90 секунд
let timerInterval = null;

// ТАЙМЕР на 1:30
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.log("⚠️ Таймер не найден, продолжаем без него");
        return;
    }
    
    // Останавливаем старый таймер
    if (timerInterval) clearInterval(timerInterval);
    
    // Сбрасываем время
    timeLeft = 90;
    updateTimerDisplay();
    
    // Запускаем новый
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
    
    console.log("⏱️ Таймер запущен: 1:30");
}

// Обновление отображения таймера
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    timerElement.textContent = `⏱️ ${formattedTime}`;
    
    // Меняем цвет
    if (timeLeft <= 15) {
        timerElement.style.color = '#ff416c';
        timerElement.style.animation = 'pulse 0.5s infinite';
    } else if (timeLeft <= 45) {
        timerElement.style.color = '#f7971e';
        timerElement.style.animation = 'none';
    } else {
        timerElement.style.color = '#00ffcc';
        timerElement.style.animation = 'none';
    }
}

// Время вышло
function handleTimeUp() {
    console.log("⏰ Время вышло!");
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    const correctIndex = quizData[currentQuestion].correct;
    
    // Отключаем кнопки
    answerButtons.forEach(button => button.disabled = true);
    
    // Подсвечиваем правильный ответ
    answerButtons.forEach((button, index) => {
        if (index === correctIndex) button.classList.add('correct');
    });
    
    // Показываем кнопку "Следующий"
    if (nextButton) nextButton.classList.remove('hidden');
    
    // Сообщение
    if (typeof showMessage === 'function') {
        showMessage('⏰ Время вышло! Правильный ответ подсвечен.', 'error');
    }
}

// Функция загрузки вопроса
function loadQuestion() {
    console.log(`📝 Загружаем вопрос ${currentQuestion + 1}/${quizData.length}`);
    
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const progressElement = document.getElementById('progress');
    
    // Проверяем элементы
    if (!questionElement || !answersElement) {
        console.error("❌ КРИТИЧЕСКАЯ ОШИБКА: Не найдены question или answers!");
        console.log("Найденные элементы:", {
            question: questionElement,
            answers: answersElement
        });
        return;
    }
    
    // Вопрос
    questionElement.textContent = quizData[currentQuestion].question;
    
    // Очищаем и добавляем ответы
    answersElement.innerHTML = '';
    quizData[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.className = 'answer-btn';
        button.onclick = () => selectAnswer(index);
        answersElement.appendChild(button);
    });
    
    // Прогресс-бар
    if (progressElement) {
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressElement.style.width = `${progress}%`;
    }
    
    // Кнопка "Следующий"
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.textContent = currentQuestion === quizData.length - 1 
            ? 'Узнать результат' 
            : 'Следующий вопрос';
        nextButton.classList.add('hidden');
    }
    
    // Запускаем таймер
    startTimer();
    
    console.log(`✅ Вопрос ${currentQuestion + 1} загружен успешно`);
}

// Выбор ответа
function selectAnswer(selectedIndex) {
    console.log(`🎯 Выбран ответ ${selectedIndex}`);
    
    // Останавливаем таймер
    if (timerInterval) clearInterval(timerInterval);
    
    const correctIndex = quizData[currentQuestion].correct;
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    
    // Отключаем кнопки
    answerButtons.forEach(button => button.disabled = true);
    
    // Подсвечиваем ответы
    answerButtons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            button.classList.add('wrong');
        }
    });
    
    // Счет
    if (selectedIndex === correctIndex) {
        score++;
        console.log(`✅ Правильно! Счёт: ${score}`);
        if (typeof playSound === 'function') playSound('correct');
    } else {
        console.log(`❌ Неправильно!`);
        if (typeof playSound === 'function') playSound('wrong');
    }
    
    // Показываем кнопку "Следующий"
    if (nextButton) nextButton.classList.remove('hidden');
}

// Следующий вопрос
function nextQuestion() {
    console.log("➡️ Переход к следующему вопросу");
    
    if (timerInterval) clearInterval(timerInterval);
    if (typeof playSound === 'function') playSound('click');
    
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        // Конец квиза
        console.log(`🏁 Квиз завершен! Результат: ${score}/${quizData.length}`);
        
        // Сохраняем результат
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage('quizScore', score);
            saveToLocalStorage('totalQuestions', quizData.length);
        } else {
            localStorage.setItem('quizScore', score);
            localStorage.setItem('totalQuestions', quizData.length);
        }
        
        // Переходим на результаты
        window.location.href = 'result.html';
    }
}

// Делаем функцию глобальной
if (typeof window !== 'undefined') {
    window.nextQuestion = nextQuestion;
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM загружен, запускаем квиз...");
    console.log("Найдено вопросов:", quizData.length);
    loadQuestion();
});
