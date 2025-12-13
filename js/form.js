// js/form.js - Обработка формы регистрации
console.log("form.js загружен!");

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value.trim(),
                contact: document.getElementById('contact').value.trim(),
                date: document.getElementById('date').value,
                participants: document.getElementById('participants').value,
                comment: document.getElementById('comment').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Получаем выбранный квест
            const quest = loadFromLocalStorage('selectedQuest');
            if (quest
