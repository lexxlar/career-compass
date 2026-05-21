// services/scoring.js

function calculateResults(userAnswers) {
    // 1. Создаем объект, где будем копить баллы для каждой профессии
    const scores = {
        frontend: 0,
        backend: 0,
        qa: 0
    };

    // 2. Проверяем, что нам вообще прислали данные, чтобы код не упал
    if (!userAnswers || !Array.isArray(userAnswers)) {
        return ['frontend', 'backend', 'qa']; // Отдаем дефолт, если что-то пошло не так
    }

    // 3. Проходим циклом по каждому ответу
    // Фронтенд пришлет нам массив вида: [{ questionId: 1, optionId: "a" }, ...]
    userAnswers.forEach(answer => {
        // Логика простая: за каждый выбор "a" даем баллы фронту, "b" — бэку, "c" — тестированию
        if (answer.optionId === 'a') scores.frontend += 5;
        if (answer.optionId === 'b') scores.backend += 5;
        if (answer.optionId === 'c') scores.qa += 5;
    });

    // 4. Сортируем ключи (профессии) по убыванию баллов.
    // На выходе получим массив, где на первом месте всегда тот, у кого больше баллов
    const sortedProfessions = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    return sortedProfessions; // Вернет, например: ['backend', 'qa', 'frontend']
}

module.exports = { calculateResults };