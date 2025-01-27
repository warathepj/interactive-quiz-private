const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score-display');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const resultsContainer = document.getElementById('results-container');
const finalScoreSpan = document.getElementById('final-score');
const feedbackElement = document.getElementById('feedback');

let shuffledQuestions, currentQuestionIndex, score;

const questions = [
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'London', correct: false },
            { text: 'Berlin', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Madrid', correct: false }
        ]
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answers: [
            { text: 'Mars', correct: true },
            { text: 'Venus', correct: false },
            { text: 'Jupiter', correct: false },
            { text: 'Saturn', correct: false }
        ]
    },
    {
        question: 'Who painted the Mona Lisa?',
        answers: [
            { text: 'Vincent van Gogh', correct: false },
            { text: 'Leonardo da Vinci', correct: true },
            { text: 'Pablo Picasso', correct: false },
            { text: 'Michelangelo', correct: false }
        ]
    },
    {
        question: 'What is the largest ocean on Earth?',
        answers: [
            { text: 'Atlantic Ocean', correct: false },
            { text: 'Indian Ocean', correct: false },
            { text: 'Arctic Ocean', correct: false },
            { text: 'Pacific Ocean', correct: true }
        ]
    },
    {
        question: 'Which element has the chemical symbol "O"?',
        answers: [
            { text: 'Gold', correct: false },
            { text: 'Silver', correct: false },
            { text: 'Oxygen', correct: true },
            { text: 'Iron', correct: false }
        ]
    }
];

function startQuiz() {
    score = 0;
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainer.classList.remove('hide');
    resultsContainer.classList.add('hide');
    nextButton.classList.remove('hide');
    nextButton.disabled = true;
    restartButton.classList.add('hide');
    updateScore();
    updateProgress();
    totalQuestionsSpan.textContent = shuffledQuestions.length;
    setNextQuestion();
}

let questionTimer;
let timerActive = false;
let questionTime = 10;

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgress();
    nextButton.disabled = true;
    clearTimeout(questionTimer);
    timerActive = true;
    // questionTimer = setTimeout(() => {
    //     timerActive = false;
    //     currentQuestionIndex++;
    //     if (currentQuestionIndex < shuffledQuestions.length) {
    //         setNextQuestion();
    //     } else {
    //         showResults();
    //     }
    // }, 10000);
    let timeLeft = questionTime;
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = timeLeft;
    questionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            timerActive = false;
            currentQuestionIndex++;
            if (currentQuestionIndex < shuffledQuestions.length) {
                setNextQuestion();
            } else {
                showResults();
            }
        }
    }, 1000);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach((answer, index) => {
        const button = answerButtonsElement.children[index];
        button.innerText = answer.text;
        button.classList.remove('correct', 'wrong');
        button.disabled = false;
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        } else {
            delete button.dataset.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.remove('hide');
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.remove('correct', 'wrong');
        button.disabled = false;
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (correct) {
        score++;
        updateScore();
        feedbackElement.textContent = "Correct!";
    } else {
        feedbackElement.textContent = "Incorrect!";
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.disabled = false;
    updateProgress();
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function updateScore() {
    scoreDisplay.innerText = score;
}

function updateProgress() {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

function showResults() {
    questionContainer.classList.add('hide');
    resultsContainer.classList.remove('hide');
    nextButton.classList.add('hide');
    restartButton.classList.remove('hide');

    finalScoreSpan.textContent = `${score} out of ${shuffledQuestions.length}`;

    const percentage = (score / shuffledQuestions.length) * 100;
    let feedback;
    if (percentage === 100) {
        feedback = "Perfect score! You're a quiz master!";
    } else if (percentage >= 80) {
        feedback = "Great job! You really know your stuff!";
    } else if (percentage >= 60) {
        feedback = "Good effort! There's room for improvement.";
    } else if (percentage >= 40) {
        feedback = "Not bad, but you might want to study a bit more.";
    } else {
        feedback = "Keep practicing! You'll get better with time.";
    }
    feedbackElement.textContent = feedback;
}

nextButton.addEventListener('click', () => {
    if (timerActive) {
        clearTimeout(questionTimer);
        timerActive = false;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
    } else {
        showResults();
    }
});
/* nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
    } else {
        showResults();
    }
}); */

restartButton.addEventListener('click', startQuiz);

startQuiz();
