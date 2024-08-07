exports.generateTeam = (arr) => {
    const developers = arr.filter(person => person.Position === "Developer");
    const businessAnalysts = arr.filter(person => person.Position === "Business Analyst");
    const dataAnalysts = arr.filter(person => person.Position === "Data Analyst");

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const randomDevelopers = shuffle(developers).slice(0, 3);
    const randomBusinessAnalyst = shuffle(businessAnalysts).slice(0, 1);
    const randomDataAnalyst = shuffle(dataAnalysts).slice(0, 1);

    return [...randomDevelopers, ...randomBusinessAnalyst, ...randomDataAnalyst];
}

