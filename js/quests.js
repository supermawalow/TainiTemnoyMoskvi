// js/quests.js - Данные и логика квестов
console.log("quests.js загружен!");

// Данные квестов
const questsData = [
    {
        id: 1,
        title: "Призраки метро",
        description: "Исследуйте заброшенные тоннели московского метро, где обитают призраки прошлого. Только для самых смелых!",
        image: "metro-bg",
        difficulty: "scary",
        type: "group",
        duration: "2 часа",
        players: "2-6 человек",
        price: "2500₽ с человека",
        rating: 4.8,
        featured: true
    },
    {
        id: 2,
        title: "Дом самоубийц",
        description: "Проникните в легендарную сталинскую высотку, где до сих пор слышны шаги тех, кто не смог уйти.",
        image: "house-bg",
        difficulty: "scary",
        type: "solo",
        duration: "1.5 часа",
        players: "1-2 человека",
        price: "3500₽",
        rating: 4.9,
        featured: true
    },
    {
        id: 3,
        title: "Тайны Китай-города",
        description: "Ночная экскурсия по самым мистическим местам старой Москвы. Подходит для новичков.",
        image: "china-town-bg",
        difficulty: "medium",
        type: "group",
        duration: "2.5 часа",
        players: "4-8 человек",
        price: "1800₽ с человека",
        rating: 4.6,
        featured: false
    },
    {
        id: 4,
        title: "Библиотека Ивана Грозного",
        description: "Поиски легендарной библиотеки в подземельях Коломенского. Загадки, головоломки и немного мистики.",
        image: "library-bg",
        difficulty: "medium",
        type: "group",
        duration: "3 часа",
        players: "3-5 человек",
        price: "3000₽ с человека",
        rating: 4.7,
        featured: true
    },
    {
        id: 5,
        title: "Прогулка с призраками",
        description: "Идеально для первого знакомства с мистической Москвой. Не слишком страшно, но очень атмосферно.",
        image: "ghost-walk-bg",
        difficulty: "easy",
        type: "group",
        duration: "2 часа",
        players: "2-10 человек",
        price: "1500₽ с человека",
        rating: 4.5,
        featured: false
    },
    {
        id: 6,
        title: "Останкинская башня: Ночная смена",
        description: "Эксклюзивный доступ в закрытые зоны телебашни после полуночи. Только по предварительной записи.",
        image: "tower-bg",
        difficulty: "scary",
        type: "solo",
        duration: "4 часа",
        players: "1 человек",
        price: "5000₽",
        rating: 5.0,
        featured: true
    }
];

// Функция загрузки квестов
function loadQuests(filter = 'all') {
    console.log("Загружаем квесты, фильтр:", filter);
    
    const grid = document.getElementById('quests-grid');
    if (!grid) {
        console.error("Элемент 'quests-grid' не найден!");
        return;
    }
    
    // Фильтрация
    let filteredQuests = questsData;
    if (filter !== 'all') {
        filteredQuests = questsData.filter(quest => 
            quest.difficulty === filter || quest.type === filter
        );
    }
    
    // Очистка
    grid.innerHTML = '';
    
    // Создание карточек
    filteredQuests.forEach(quest => {
        const card = document.createElement('div');
        card.className = 'quest-card';
        card.onclick = () => selectQuest(quest.id);
        
        // Фоновые цвета для изображений
        const bgColors = {
            'metro-bg': 'linear-gradient(135deg, #1a1a2e, #16213e)',
            'house-bg': 'linear-gradient(135deg, #2d2d2d, #1a1a1a)',
            'china-town-bg': 'linear-gradient(135deg, #0c2461, #1e3799)',
            'library-bg': 'linear-gradient(135deg, #3d3d3d, #2c2c2c)',
            'ghost-walk-bg': 'linear-gradient(135deg, #485460, #808e9b)',
            'tower-bg': 'linear-gradient(135deg, #2c3e50, #34495e)'
        };
        
        card.innerHTML = `
            <div class="quest-image" style="background: ${bgColors[quest.image] || '#000'};">
                ${quest.featured ? '<div class="quest-badge">🔥 ХИТ</div>' : ''}
                <div class="quest-badge" style="left: 15px; right: auto; background: ${getDifficultyColor(quest.difficulty)};">
                    ${getDifficultyText(quest.difficulty)}
                </div>
            </div>
            <div class="quest-content">
                <h3 class="quest-title">${quest.title}</h3>
                <p class="quest-description">${quest.description}</p>
                <div class="quest-details">
                    <div class="quest-detail">⏱️ ${quest.duration}</div>
                    <div class="quest-detail">👥 ${quest.players}</div>
                    <div class="quest-detail">⭐ ${quest.rating}</div>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <button class="cta-button" style="padding: 0.8rem 2rem; width: 100%;" 
                            onclick="event.stopPropagation(); selectQuest(${quest.id})">
                        Выбрать за ${quest.price}
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    console.log("Загружено квестов:", filteredQuests.length);
}

// Вспомогательные функции
function getDifficultyColor(difficulty) {
    const colors = {
        'scary': 'linear-gradient(45deg, #ff416c, #ff4b2b)',
        'medium': 'linear-gradient(45deg, #f7971e, #ffd200)',
        'easy': 'linear-gradient(45deg, #00b09b, #96c93d)'
    };
    return colors[difficulty] || 'linear-gradient(45deg, #666, #999)';
}

function getDifficultyText(difficulty) {
    const texts = {
        'scary': 'ОЧЕНЬ СТРАШНО',
        'medium': 'СРЕДНЯЯ',
        'easy': 'ЛЁГКИЙ'
    };
    return texts[difficulty] || difficulty;
}

// Фильтрация квестов
function filterQuests(type) {
    console.log("Фильтруем квесты по типу:", type);
    
    if (typeof playSound === 'function') {
        playSound('click');
    }
    
    // Обновляем активную кнопку
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Загружаем отфильтрованные квесты
    loadQuests(type);
}

// Выбор квеста
function selectQuest(questId) {
    console.log("Выбран квест ID:", questId);
    
    if (typeof playSound === 'function') {
        playSound('correct');
    }
    
    const quest = questsData.find(q => q.id === questId);
    if (quest) {
        // Сохраняем выбранный квест
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage('selectedQuest', quest);
        } else {
            localStorage.setItem('selectedQuest', JSON.stringify(quest));
        }
        
        // Переходим к регистрации
        window.location.href = `register.html?quest=${questId}`;
    } else {
        console.error("Квест не найден:", questId);
    }
}

// Функция для перехода к выбору квеста из других страниц
function chooseQuest() {
    if (typeof playSound === 'function') {
        playSound('click');
    }
    window.location.href = 'quests.html';
}

// Функция возврата к выбору квеста
function goToQuests() {
    if (typeof playSound === 'function') {
        playSound('click');
    }
    window.location.href = 'quests.html';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен, загружаем квесты...");
    loadQuests();
});
