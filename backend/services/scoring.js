// services/scoring.js

function calculateResults(userAnswers) {
    const scores = {
        frontend: 0,
        backend: 0,
        qa: 0,
        android: 0,
    };

    userAnswers.forEach(answer => {
        if (answer.optionId === 'a') scores.frontend += 5;
        if (answer.optionId === 'b') scores.backend += 5;
        if (answer.optionId === 'c') scores.qa += 5;
        if (answer.optionId === 'd') scores.android += 5;
    });

    const sortedProfessions = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    return sortedProfessions;
}

module.exports = { calculateResults };
