init();

const modal = new tingle.modal({
    closeMethods: ['overlay', 'button', 'escape'],
    onOpen: () => {
        bindSubmitEvent();
    }
});

function init() {
    handleClickEvents();
}

function handleClickEvents() {
    document.querySelector('.js-open-add-formular').addEventListener('click', () => {
        modal.setContent(document.querySelector('.js-add-formular').innerHTML);
        modal.open();
    });
}

function bindSubmitEvent() {
    const btns = document.querySelectorAll('.js-add-recipe-btn');
    
    btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = document.querySelector('.js-form');
            console.log(form);
            const formData = new FormData(form);
            console.log(formData.getAll());
        });
    });
}


