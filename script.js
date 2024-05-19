'use strict';

const testTextElement = document.getElementById('test-text');
const userInputElement = document.getElementById('user-input');
const startButton = document.getElementById('start-button');
const resultsElement = document.getElementById('results');
const timerElement = document.getElementById('timer');

//This array holds multiple sample texts from which one will be randomly selected for the typing test
const testTexts = [
    `Lulu was out for her usual morning walk when she took a wrong turn and 
    found herself in the woods. She tried to retrace her steps, but soon 
    realized she was lost.`,
    `It had been years since the car had been driven. It sat in the 
    driveway, slowly being taken over by rust and weeds. The windows 
    were boarded up and the tires were long gone. But to a young boy,
    it was the most beautiful car he had ever seen.`,
    `For many people, birds are simply beings that exist outside their 
    windows or that they might see on a nature hike. However, for 
    birdwatchers, these creatures are a source of never - ending fascination. 
    Bird watching can be a relaxing hobby or a lifelong passion, and it offers 
    a unique opportunity to connect with nature. Each time you go bird
    watching, you have the chance to encounter new species and learn 
    more about the incredible world we live in.`,
    `Many of us were told as children that we need to eat our vegetables 
    to be healthy. And it turns out, our parents were right! A diet rich in
    vegetables has been linked with a lower risk of developing many chronic
    diseases, including heart disease, stroke, cancer, and type 2 diabetes.`,
    `All that glitters is not gold. The ability to read starts with being able 
    to recognize the individual sounds that make up words, a skill known as
    phonemic awareness.`,
    `The young boy took it for a spin around the block, feeling like the 
    luckiest kid in the world. Even though it was just an old rust - bucket,
    to him it was the most special car in the world.`
];

let startTime;
let timer;
let correctWordsCount = 0;

//This function initializes the test by selecting a random text, resetting the input
// field, and starting the timer and input listener
function startTest() {
    const randomText = testTexts[Math.floor(Math.random() * testTexts.length)];
    testTextElement.textContent = randomText;
    userInputElement.value = '';
    userInputElement.disabled = false;
    userInputElement.focus();
    startTime = new Date().getTime();
    resultsElement.textContent = '';
    correctWordsCount = 0;

    userInputElement.removeEventListener('input', checkInput);
    userInputElement.addEventListener('input', checkInput);

    startTimer(60);// Start the timer for 1 minute
}

//This function manages the countdown timer and updates the timer 
//element every second.
function startTimer(duration) {
    let timeRemaining = duration;
    timerElement.textContent = `Time remaining: ${timeRemaining} s`;

    timer = setInterval(() => {
        --timeRemaining;
        timerElement.textContent = `Time remaining: ${timeRemaining} s`;
        if (timeRemaining === 0) {
            clearInterval(timer);
            finishTest();
        }
    }, 1000);
}

//This function compares the user input with the target text in real-time, 
//updates the test text to show correct and incorrect characters in different colors, 
//and counts the number of correctly typed words.
function checkInput() {
    const typedText = userInputElement.value;
    const targetText = testTextElement.textContent;
    let formattedText = '';

    for (let i = 0; i < targetText.length; ++i) {
        if (i < typedText.length) {
            if (typedText[i] === targetText[i]) {
                formattedText += `<span style="color: green;">${targetText[i]}</span>`;
            } else {
                formattedText += `<span style="color: red;">${targetText[i]}</span>`;
            }
        } else {
            formattedText += `<span>${targetText[i]}</span>`;
        }
    }

    testTextElement.innerHTML = formattedText;

    const typedWords = typedText.trim().split(/\s+/);
    const targetWords = targetText.trim().split(/\s+/);
    correctWordsCount = 0;

    // Use a map to track the frequency of each word in the target text
    const targetWordMap = {};
    for (const word of targetWords) {
        if (targetWordMap[word]) {
            ++targetWordMap[word];
        } else {
            targetWordMap[word] = 1;
        }
    }

    // Count correct words based on the map
    for (const word of typedWords) {
        if (targetWordMap[word]) {
            ++correctWordsCount;
            --targetWordMap[word]; // Decrement the count in the map
        }
    }

    if (typedText === targetText) {
        finishTest();
    }
}

//This function stops the timer, calculates the time taken and accuracy, 
//and displays the results.
function finishTest() {
    clearInterval(timer);
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    const typedText = userInputElement.value;
    const targetText = testTextElement.textContent;
    const accuracy = calculateAccuracy(typedText, targetText);

    resultsElement.innerHTML = `
        <p>Time taken: ${timeTaken.toFixed(2)} seconds</p>
        <p>Accuracy: ${accuracy.toFixed(2)}%</p>
        <p>You have written: ${correctWordsCount} correct words!</p>
        `;
    userInputElement.disabled = true;
}

//This function calculates the accuracy of the typed text based on the number 
//of correctly typed words compared to the target text.
function calculateAccuracy(typed, target) {
    const typedChars = typed.split(/\s+/);
    const targetChars = target.split(/\s+/);
    let correctChars = 0;

    typedChars.forEach((char, index) => {
        if (char === targetChars[index]) {
            ++correctChars;
        }
    });
    return (correctChars / targetChars.length) * 100;
}

//This line adds a click event listener to the start button, 
//triggering the startTest function when clicked.
startButton.addEventListener('click', startTest);
