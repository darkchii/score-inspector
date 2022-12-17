export async function processScores(scores) {
    scores = prepareScores(scores);

    const data = {
        grades: {
            XH: 0,
            X: 0,
            SH: 0,
            S: 0,
            A: 0,
            B: 0,
            C: 0,
            D: 0
        },
        average_pp: 0,
        clears: scores.length,
        total: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0
        },
        average: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0
        }
    };

    for (const score of scores) {
        const grade = score.rank;
        data.grades[grade]++;

        data.total.pp += score.pp ?? 0;
        data.total.score += score.score ?? 0;
        data.total.acc += score.accuracy ?? 0;
        data.total.length += score.length ?? 0;
    }

    if (data.clears > 0) {
        data.average.pp = data.total.pp / data.clears;
        data.average.score = data.total.score / data.clears;
        data.average.acc = data.total.acc / data.clears;
        data.average.length = data.total.length / data.clears;
    }

    return data;
}

function prepareScores(scores) {
    scores.forEach(score => {
        score.pp = parseFloat(score.pp ?? 0);
        score.accuracy = parseFloat(score.accuracy) ?? 0;
    });

    return scores;
}