// quiz.js - 10 вопросов, таймер 20 секунд
console.log("✅ quiz.js загружен - 10 вопросов, таймер 20 секунд");

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
let timeLeft = 20; // 20 СЕКУНД НА ВОПРОС
let timerInterval = null;

// ТАЙМЕР на 20 секунд
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.log("⚠️ Таймер не найден, продолжаем без него");
        return;
    }
    
    // Останавливаем старый таймер
    if (timerInterval) clearInterval(timerInterval);
    
    // Сбрасываем время
    timeLeft = 20;
    updateTimerDisplay();
    
    // Запускаем новый таймер
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
    
    console.log("⏱️ Таймер запущен: 20 секунд");
}

// Обновление отображения таймера
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    // Форматируем время (добавляем 0 перед секундами, если меньше 10)
    const formattedTime = timeLeft < 10 ? `0${timeLeft}` : `${timeLeft}`;
    timerElement.textContent = `⏱️ ${formattedTime} сек`;
    
    // Меняем цвет в зависимости от оставшегося времени
    if (timeLeft <= 5) {
        // Красный с анимацией пульсации при 5 секундах и меньше
        timerElement.style.color = '#ff416c';
        timerElement.style.fontWeight = 'bold';
        timerElement.style.animation = 'pulse 0.5s infinite';
    } else if (timeLeft <= 10) {
        // Желтый при 10 секундах и меньше
        timerElement.style.color = '#f7971e';
        timerElement.style.fontWeight = 'bold';
        timerElement.style.animation = 'none';
    } else {
        // Зеленый при более чем 10 секундах
        timerElement.style.color = '#00ffcc';
        timerElement.style.fontWeight = 'normal';
        timerElement.style.animation = 'none';
    }
}

// Время вышло
function handleTimeUp() {
    console.log("⏰ Время вышло!");
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    const correctIndex = quizData[currentQuestion].correct;
    
    // Отключаем все кнопки ответов
    answerButtons.forEach(button => button.disabled = true);
    
    // Подсвечиваем правильный ответ
    answerButtons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');
            // Анимация для правильного ответа
            button.style.animation = 'pulse 0.5s';
        }
    });
    
    // Показываем кнопку "Следующий вопрос"
    if (nextButton) {
        nextButton.classList.remove('hidden');
    }
    
    // Показываем сообщение о том, что время вышло
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
    
    // Проверяем, что элементы существуют
    if (!questionElement || !answersElement) {
        console.error("❌ ОШИБКА: Не найдены элементы вопроса или ответов!");
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
        
        // Обработчик клика по ответу
        button.onclick = () => {
            console.log(`🎯 Выбран ответ: ${index}`);
            selectAnswer(index);
        };
        
        answersElement.appendChild(button);
    });
    
    // Обновляем прогресс-бар
    if (progressElement) {
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressElement.style.width = `${progress}%`;
    }
    
    // Обновляем текст кнопки "Следующий вопрос"
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.textContent = currentQuestion === quizData.length - 1 
            ? 'Узнать результат' 
            : 'Следующий вопрос';
        nextButton.classList.add('hidden');
    }
    
    // Запускаем таймер на 20 секунд
    startTimer();
    
    console.log(`✅ Вопрос ${currentQuestion + 1} загружен успешно`);
}

// Функция выбора ответа
function selectAnswer(selectedIndex) {
    console.log(`🎯 Выбран ответ ${selectedIndex}`);
    
    // Останавливаем таймер при выборе ответа
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    const correctIndex = quizData[currentQuestion].correct;
    const answerButtons = document.querySelectorAll('.answer-btn');
    const nextButton = document.getElementById('next-btn');
    
    // Отключаем все кнопки ответов
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Подсвечиваем правильный и неправильный ответы
    answerButtons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');
            // Анимация для правильного ответа
            button.style.animation = 'pulse 0.5s';
        } else if (index === selectedIndex && index !== correctIndex) {
            button.classList.add('wrong');
        }
    });
    
    // Увеличиваем счет, если ответ правильный
    if (selectedIndex === correctIndex) {
        score++;
        console.log(`✅ Правильно! Текущий счет: ${score}`);
        
        // Воспроизводим звук правильного ответа
        if (typeof playSound === 'function') {
            playSound('correct');
        }
    } else {
        console.log(`❌ Неправильно!`);
        
        // Воспроизводим звук неправильного ответа
        if (typeof playSound === 'function') {
            playSound('wrong');
        }
    }
    
    // Показываем кнопку "Следующий вопрос"
    if (nextButton) {
        nextButton.classList.remove('hidden');
    }
}

// Функция перехода к следующему вопросу
function nextQuestion() {
    console.log("➡️ Переход к следующему вопросу");
    
    // Останавливаем таймер
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Воспроизводим звук клика
    if (typeof playSound === 'function') {
        playSound('click');
    }
    
    // Переходим к следующему вопросу
    currentQuestion++;
    
    // Проверяем, остались ли еще вопросы
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        // Квиз завершен
        console.log(`🏁 Квиз завершен! Итоговый счет: ${score}/${quizData.length}`);
        
        // Сохраняем результаты в localStorage
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage('quizScore', score);
            saveToLocalStorage('totalQuestions', quizData.length);
        } else {
            // Резервный вариант, если функция не определена
            localStorage.setItem('quizScore', score);
            localStorage.setItem('totalQuestions', quizData.length);
        }
        
        // Переходим на страницу результатов
        window.location.href = 'result.html';
    }
}

// Делаем функцию глобальной для использования в HTML
if (typeof window !== 'undefined') {
    window.nextQuestion = nextQuestion;
}

// Загружаем первый вопрос при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Страница загружена, запускаем квиз...");
    console.log(`Всего вопросов: ${quizData.length}`);
    loadQuestion();
});
