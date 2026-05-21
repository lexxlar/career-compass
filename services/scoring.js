// services/scoring.js

function calculateResults(userAnswers) {
    // Хранилище баллов для профессий
    const scores = {
        frontend: 0,
        backend: 0,
        qa: 0
    };

    // Пробегаемся по ответам пользователя и накидываем баллы
    userAnswers.forEach(answer => {
        if (answer.optionId === 'a') scores.frontend += 5;
        if (answer.optionId === 'b') scores.backend += 5;
        if (answer.optionId === 'c') scores.qa += 5;
    });

    // Сортируем ключи объекта (профессии) по убыванию баллов
    // Тот, у кого баллов больше всего, окажется на индексе [0]
    const sortedProfessions = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    return sortedProfessions; 
}

module.exports = { calculateResults };