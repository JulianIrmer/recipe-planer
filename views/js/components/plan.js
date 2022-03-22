init();

function init() {
    addDatePickerLogic();
    deletePlan();
    checkRecipe();
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