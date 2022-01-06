const questoions = [
        'Где вы хотите разместить гардеробную?',
        'Выберите формат гардеробной?',
        'Какой стиль интерьера предпочитаете?',
        'Выберите размер гардеробной (в погонных метрах):'
    ],
    images = [
        ['1.jpg', '2.jpg'],
        ['3.jpg', '6.jpg ', '4.jpg ', '5.jpg'],
        ['7.jpg ', '8.jpg ', '9.jpg ', '10.png'],
        []
    ],
    variants = [
        ['Дом', 'Квартира'],
        ['Мужская', 'Женская ', 'Детская ', 'Для всей семьи'],
        ['Классический ', 'Современный ', 'Лофт ', 'Пока не определился(-ась)'],
        ['0-5м', '6-10м ', '11-20м', '20м+']
    ],
    radioNames = [
        'where',
        'format',
        'style',
        'square'
    ],
    imageContClasses = ['question_images', 'answer-images', 'answer-images__group answer-images__group_layout-scroll'],
    notImageContClasses = ['question_variants', 'answer-variants', 'answer-variants__group'],
    prevBtn = document.querySelector('.quiz-buttons__button_prev'),
    nextBtn = document.querySelector('.quiz-buttons__button_next'),
    quizCont = document.querySelector('.quiz__question'),
    quizTitle = document.querySelector('.quiz__question-title .is-block'),
    progBarLabel = document.querySelector('.progress-bar-linear__label span'),
    progBarField = document.querySelector('.progress-bar-linear__field span'),
    imageURL = 'assets/images/',
    answers = {},
    forwardLeave = ['quiz__question_animation_forward-leave-active', 'quiz__question_animation_forward-leave-to'],
    forwardEnter = ['quiz__question_animation_forward-enter-active', 'quiz__question_animation_forward-enter-to'],
    backLeave = ['quiz__question_animation_back-leave-active', 'quiz__question_animation_back-leave-to'],
    backEnter = ['quiz__question_animation_back-enter-active', 'quiz__question_animation_back-enter-to'],
    animDuration = 150;

let step = 0;

disableBtn(prevBtn);
disableBtn(nextBtn);
renderQues();
inputChange();

quizCont.classList.add('question_images');

// go to prev questioin
prevBtn.addEventListener('click', () => {
    decreaseStep();
    changeQuestion();
    if (step == 0) {
        disableBtn(prevBtn)
    }

})

// go to next questioin
nextBtn.addEventListener('click', () => {
    toNextSlide()
})




// ------------- FUNCTIONS ------------- \\


// change progress bar percent
function changeProgressBar() {
    let percent = Math.floor(25 * (step)) + '%'
    progBarLabel.textContent = percent
    progBarField.style.width = percent
}

// activate next question checked input
function activateQuestion() {
    setTimeout(() => {
        if (Object.keys(answers).length > 0) {
            let selectedInput = quizCont.querySelectorAll(`[value="${answers[step]}"]`)[0];
            if (selectedInput) {
                selectedInput.checked = true
                activateInput(selectedInput);

                // enable next btn
                activateNextBtn();
            }
        }

    }, animDuration + 200);
}

// activate next btn 
function activateNextBtn() {
    enableBtn(nextBtn);
    nextBtn.classList.add('is-blicked');
}

// add class to checked input
function activateInput(input) {
    if (step == 3) {
        input.parentElement.parentElement.classList.add('answer-variants__variant-text_selected')

    } else {
        let imgWr = quizCont.querySelector('.answer-image_checked');
        if (imgWr) {
            imgWr.classList.remove('answer-image_checked');
        }
        input.parentElement.querySelector('.answer-image').classList.add('answer-image_checked');
    }

}

// get key by value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// to next slide
function toNextSlide() {
    if (step <= 3) {
        increaseStep();
        changeQuestion();
        enableBtn(prevBtn)
    }
}

// input changes
function inputChange() {
    quizCont.querySelectorAll('[type=radio]').forEach(item => {
        item.addEventListener('change', (event) => {

            // current input
            let $this = event.target;

            // add class to checked input
            activateInput($this)

            // save answer 
            answers[step] = $this.value;

            // make changes
            toNextSlide();
            if (step == 4) {
                enableBtn(nextBtn);
                showForm()
            }
        })
    })
}

// change question
function changeQuestion() {

    activateQuestion()

    // add leaving class
    setTimeout(() => {
        forwardLeave.forEach(item => {
            quizCont.classList.add(item);
            quizTitle.classList.add(item);
        })
    }, animDuration)

    // add entering animation, remove leaving animation
    setTimeout(() => {
        // change question text 
        quizTitle.textContent = questoions[step];

        // remove leaving class
        forwardLeave.forEach(item => {
            quizCont.classList.remove(item);
            quizTitle.classList.remove(item);
        })

        // add entering class
        forwardEnter.forEach(item => {
            quizCont.classList.add(item);
            quizTitle.classList.add(item);
        })

        // render question
        renderQues()

        // activate input change 
        inputChange();

        // check checked inputs amount
        let count = 0;
        quizCont.querySelectorAll('[type=radio]').forEach(element => {
            if (element.checked) { count++; }
        });
        if (count <= 0) {
            disableBtn(nextBtn)
        }
    }, animDuration + 100)

    // remove entering animation
    setTimeout(() => {
        forwardEnter.forEach(item => {
            quizCont.classList.remove(item);
            quizTitle.classList.remove(item);
        })
    }, animDuration + 200)

    // last step
    if (step == 3) {
        nextBtn.classList.add('quiz-buttons__button_last-step')
        document.querySelector('.quiz-buttons__button_last-step').addEventListener('click', () => {
            showForm()
        })
    } else {
        nextBtn.classList.remove('quiz-buttons__button_last-step')
    }

    changeProgressBar()

}
// show quiz form
function showForm() {
    let template = document.getElementById('quiz-form').content.cloneNode(true).children[0];

    document.querySelector('.quiz').classList.add('quiz_animation_slide-leave-active', 'quiz_animation_slide-leave-to');
    setTimeout(() => {
            document.querySelector('.quiz-container').innerHTML = '';
            document.querySelector('.quiz-container').append(template);
            document.querySelector('.quiz__lead-form').classList.add('quiz__question_animation_forward-enter-active', 'quiz__question_animation_forward-enter-to')

            if (document.querySelector('.lead-form__button')) {
                document.querySelector('.lead-form__button').addEventListener('click', (event) => {
                    let template = document.getElementById('thanks').content.cloneNode(true).children[0];

                    setTimeout(() => {
                        document.querySelector('.quiz-container').innerHTML = '';
                        document.querySelector('.quiz-container').append(template);
                    }, animDuration + 100)
                })
            }


        }, animDuration + 100)
        // form submit

}

// increase step
function increaseStep() {
    step++;
}

// decrease step
function decreaseStep() {
    step--;
}

// disable btn
function disableBtn(btn) {
    btn.disabled = true;
    btn.classList.remove('is-blicked');
}

// enable btn
function enableBtn(btn) {
    btn.disabled = false;
}

// render question
function renderQues() {
    let renderedQuestions;
    if (step < 4) {
        if (images[step].length != 0) {
            renderedQuestions = renderImageQues(step, images[step].length)
        } else {
            renderedQuestions = renderTextQues(step)
        }
        quizCont.innerHTML = '';
        quizCont.prepend(renderedQuestions);
    }

}

// render images questions
function renderImageQues(stepIndex, imagesLength) {

    let layout = document.createElement('div'),
        layoutInnerCont = document.createElement('div');
    layout.className = 'answer-images';
    layoutInnerCont.className = 'answer-images__group answer-images__group_layout-scroll';
    layout.appendChild(layoutInnerCont);

    for (let j = 0; j < imagesLength; j++) {
        layoutInnerCont.innerHTML += `
        <div class="answer-images__answer-container answer-images__answer-container__type_square">
            <label class="b-radio radio">
                <input type="radio" name="${radioNames[stepIndex]}" value="${variants[stepIndex][j]}">
                <span class="check"></span>
                <span class="control-label">
                    <div class="answer-image answer-image_type_square">
                        <div class="answer-image__img-container answer-image__img-container_with-img">
                            <img src="${imageURL + images[stepIndex][j]}" class="answer-image__img">
                        </div>
                        <div class="answer-image__title ">${variants[stepIndex][j]}</div>
                    </div>
                </span>
            </label>
        </div>
        `
    }

    return layout;
}

// render texts questions
function renderTextQues(stepIndex) {
    let layout = document.createElement('div'),
        layoutInnerCont = document.createElement('div');
    layout.className = 'answer-variants';
    layoutInnerCont.className = 'answer-variants__group';
    layout.appendChild(layoutInnerCont);

    for (let j = 0; j < variants[stepIndex].length; j++) {
        layoutInnerCont.innerHTML += `
        <div class="answer-variants__variant-text">
            <label class="b-radio radio">
                <input type="radio" name="${radioNames[stepIndex]}" value="${variants[stepIndex][j]}">
                <span class="check"></span>
                <span class="control-label">
                    <div class="answer">
                        <div class="answer__title">${variants[stepIndex][j]}&nbsp;</div>
                    </div>
                </span>
            </label>
        </div>
        `
    }

    quizCont.classList.remove('question_images');
    quizCont.classList.add('question_variants');


    return layout;
}