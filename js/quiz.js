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
        question: "Где по легенде можно встречить призрак 'Белой пианистки'?",
        answers: [
            "В Консерватории",
            "В Останкинской башне",
            "В Цирке на Цветном бульваре", 
            "В Большом театре"
        ],
        correct: 3
    }
    // Ты можешь добавить ещё вопросы здесь!
];

let currentQuestion = 0;
let score = 0;

// Функция для загрузки вопроса
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const progressElement = document.getElementById('progress');
    
    // Показываем текущий вопрос
    questionElement.textContent = quizData[currentQuestion].question;
    
    // Очищаем предыдущие ответы
    answersElement.innerHTML = '';
    
    // Добавляем варианты ответов
    quizData[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.className = 'answer-btn';
        button.onclick = () => selectAnswer(index);
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
    
    // Увеличиваем счёт если ответ правильный
    if (selectedIndex === correctIndex) {
        score++;
    }
    
    // Показываем кнопку "Следующий вопрос"
    nextButton.classList.remove('hidden');
}

// Функция перехода к следующему вопросу
function nextQuestion() {
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