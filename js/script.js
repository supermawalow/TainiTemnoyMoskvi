// Общие функции для всего сайта

// Функция для начала квиза
function startQuiz() {
    window.location.href = 'quiz.html';
}

// Функция для показа уведомлений
function showMessage(message, type = 'info') {
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
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
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