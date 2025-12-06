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
    
    // Обновляем текст на кнопке в зависимости от вопроса
    const nextButton = document.getElementById('next-btn');
    if (currentQuestion === quizData.length - 1) {
        nextButton.textContent = 'Узнать результат';
    } else {
        nextButton.textContent = 'Следующий вопрос';
    }
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
        // Можно добавить звук или анимацию для правильного ответа
    } else {
        // Можно добавить звук или анимацию для неправильного ответа
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
