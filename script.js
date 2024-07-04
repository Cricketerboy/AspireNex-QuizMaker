document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question');
    const previousQuestionBtn = document.getElementById('previous-question');
    const nextQuestionBtn = document.getElementById('next-question');
    const quizTaker = document.getElementById('quiz-taker');
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const quizQuestions = document.getElementById('quiz-questions');
    const submitQuizBtn = document.getElementById('submit-quiz');
    const reattemptQuizBtn = document.getElementById('reattempt-quiz'); // Reattempt Quiz button
    const quizFeedback = document.getElementById('quiz-feedback');
    const previousQuestionBtnTake = document.getElementById('previous-question-take');
    const nextQuestionBtnTake = document.getElementById('next-question-take');

    let questionCount = 1;
    let currentQuestionIndex = 1;
    let quizData = [];
    quizFeedback.innerHTML = 'Keep going! Answer all questions to see your results.';

    // Add a new question fieldset
    addQuestionBtn.addEventListener('click', () => {
        questionCount++;
        currentQuestionIndex = questionCount;
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('question');
        newQuestion.setAttribute('id', `question-${questionCount}`);
        newQuestion.innerHTML = `
            <label for="question-${questionCount}-text">Question ${questionCount}:</label>
            <input type="text" id="question-${questionCount}-text" class="question-text" required>
            <label>Options:</label>
            <input type="text" class="option" required>
            <input type="text" class="option" required>
            <input type="text" class="option" required>
            <input type="text" class="option" required>
            <label for="correct-answer-${questionCount}">Correct Answer (1-4):</label>
            <input type="number" id="correct-answer-${questionCount}" class="correct-answer" min="1" max="4" required>
        `;
        questionsContainer.appendChild(newQuestion);
        showQuestion(currentQuestionIndex);
    });

    // Show a specific question during quiz creation
    function showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, i) => {
            question.classList.remove('active');
            if (i + 1 === index) {
                question.classList.add('active');
            }
        });

        previousQuestionBtn.style.display = index > 1 ? 'inline-block' : 'none';
        nextQuestionBtn.style.display = index < questionCount ? 'inline-block' : 'none';
    }

    // Navigate to the previous question during quiz creation
    previousQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 1) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    // Navigate to the next question during quiz creation
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questionCount) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    // Show the first question by default during quiz creation
    showQuestion(currentQuestionIndex);

    // Handle quiz creation submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quizTitle = document.getElementById('quiz-title').value;
        const questions = document.querySelectorAll('.question');
        quizData = Array.from(questions).map((question, index) => {
            return {
                question: question.querySelector('.question-text').value,
                options: Array.from(question.querySelectorAll('.option')).map(opt => opt.value),
                correctAnswer: parseInt(question.querySelector('.correct-answer').value)
            };
        });

        quizTitleDisplay.textContent = quizTitle;
        quizQuestions.innerHTML = '';
        quizData.forEach((q, index) => {
            const questionElem = document.createElement('div');
            questionElem.classList.add('quiz-question');
            questionElem.innerHTML = `
                <p>${q.question}</p>
                ${q.options.map((opt, i) => `<label><input type="radio" name="question-${index}" value="${i + 1}">${opt}</label>`).join('<br>')}
            `;
            quizQuestions.appendChild(questionElem);
        });

        document.getElementById('quiz-creator').style.display = 'none';
        quizTaker.style.display = 'block';
        showQuestionTake(0); // Show first question during quiz taking
    });

    // Handle navigation during quiz taking
    function showQuestionTake(index) {
        quizFeedback.innerHTML = 'Keep going! Answer all questions to see your results.';
        const questions = document.querySelectorAll('.quiz-question');
        questions.forEach((question, i) => {
            question.style.display = 'none';
            if (i === index) {
                question.style.display = 'block';
            }
        });

        previousQuestionBtnTake.style.display = index > 0 ? 'inline-block' : 'none';
        nextQuestionBtnTake.style.display = index < questions.length - 1 ? 'inline-block' : 'none';
        submitQuizBtn.style.display = index === questions.length - 1 ? 'inline-block' : 'none';
        reattemptQuizBtn.style.display = 'none'; // Hide the reattempt quiz button
    }

    // Navigate to the previous question during quiz taking
    previousQuestionBtnTake.addEventListener('click', () => {
        const currentQuestionIndexTake = Array.from(document.querySelectorAll('.quiz-question')).findIndex(q => q.style.display === 'block');
        if (currentQuestionIndexTake > 0) {
            showQuestionTake(currentQuestionIndexTake - 1);
        }
    });

    // Navigate to the next question during quiz taking
    nextQuestionBtnTake.addEventListener('click', () => {
        const currentQuestionIndexTake = Array.from(document.querySelectorAll('.quiz-question')).findIndex(q => q.style.display === 'block');
        if (selectedOption) {
            if (currentQuestionIndexTake < quizData.length - 1) {
                showQuestionTake(currentQuestionIndexTake + 1);
            }
        } else {
            alert('Please select an option before proceeding to the next question.');
        }
    });

    // Handle quiz submission during quiz taking
    submitQuizBtn.addEventListener('click', () => {
        const userAnswers = Array.from(document.querySelectorAll('.quiz-question')).map((q, index) => {
            const selectedOption = q.querySelector('input[type="radio"]:checked');
            return selectedOption ? parseInt(selectedOption.value) : null;
        });

        // Check if all questions have been answered
        const allQuestionsAnswered = userAnswers.every(ans => ans !== null);

        if (allQuestionsAnswered) {
            let correctCount = 0;
            userAnswers.forEach((ans, index) => {
                if (ans === quizData[index].correctAnswer) {
                    correctCount++;
                }
            });

            quizFeedback.innerHTML = `You got ${correctCount} out of ${quizData.length} correct !`;
        } else {
            alert('Please answer all questions before submitting the quiz.');
            quizFeedback.innerHTML = 'Keep going ! Answer all questions to see your results.';
        }

        if(allQuestionsAnswered) {
            // Hide the previous question button after submitting quiz
        previousQuestionBtnTake.style.display = 'none';
        // Hide the submit quiz button and show the reattempt quiz button
        submitQuizBtn.style.display = 'none';
        reattemptQuizBtn.style.display = 'inline-block';
        }
    });

    // Handle reattempt quiz
    reattemptQuizBtn.addEventListener('click', () => {
        // Clear previous results
        quizFeedback.innerHTML = '';
        const quizQuestions = document.querySelectorAll('.quiz-question');
        quizQuestions.forEach((question) => {
            const selectedOption = question.querySelector('input[type="radio"]:checked');
            if (selectedOption) {
                selectedOption.checked = false;
            }
        });

        // Reset quiz to the first question
        showQuestionTake(0);
        // Hide the reattempt quiz button and show the submit quiz button
        reattemptQuizBtn.style.display = 'none';
        submitQuizBtn.style.display = 'inline-block';
    });
});
