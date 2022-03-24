init();

function init() {
    addDatePickerLogic();
    deletePlan();
    checkRecipe();
    rerollRecipe();
}

function addDatePickerLogic() {
    const startInput = document.querySelector('.js-start-date');
    const endInput = document.querySelector('.js-end-date');

    if (!startInput || !endInput) return;
    setCorrectDate(startInput, endInput);
    handleDateInputs(startInput, endInput);
}

function setCorrectDate(startInput, endInput) {
    startInput.valueAsDate = new Date();
    endInput.valueAsDate = new Date();
}

function handleDateInputs(startInput, endInput) {
    startInput.addEventListener('change', () => {
        endInput.setAttribute('min', startInput.value);
    });

    endInput.addEventListener('change', () => {
        startInput.setAttribute('max', endInput.value);
    });
}

function deletePlan() {
    const btns = document.querySelectorAll('.js-delete-plan');
    if (btns.length === 0) return;

    btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const {id} = btn.dataset;
            if (!id) return;
            const parent = document.querySelector(`.plan-container[data-id="${id}"]`);

            fetch(`/plan/api?id=${id}`, {method: 'DELETE'});
            parent.classList.add('delete-right');
            parent.addEventListener('transitionend', () => {
                parent.remove();
            });
        });
    });
}

function rerollRecipe() {
    const buttons = document.querySelectorAll('.js-reroll-recipe');
    if (buttons.length === 0) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            updateRecipe(btn);
        });
    });
}

async function updateRecipe(btn) {
    const {planId, recipeId} = btn.dataset;
    const container = document.querySelector(`.plan-container[data-id="${planId}"]`);
    const allLis = container.querySelectorAll(`.js-li-item[data-recipe-id="${recipeId}"]`);
    allLis.forEach((li) => {
        li.innerHTML = '<div class="loader"></div>';
    });

    const url = `/plan/api/addnewrecipe?planId=${planId}&recipeId=${recipeId}`;
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();

    for (let i = 0; i < allLis.length; i++) {
        allLis[i].parentElement.innerHTML = response.html[i];
        container.querySelector(`.js-reroll-recipe[data-recipe-id="${response.ids[i]}"]`).addEventListener('click', function() {
            updateRecipe(this);
        });
    }
}

function checkRecipe() {
    const checkboxes = document.querySelectorAll('.js-check-recipe');
    if (checkboxes.length === 0) return;

    checkboxes.forEach((box) => {
        box.addEventListener('click', () => {
            const {planId, recipeId} = box.dataset;
            fetch(`plan/api?planId=${planId}&recipeId=${recipeId}`, {method: 'PATCH'});
        });
    });
}