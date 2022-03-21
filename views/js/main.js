init();

function init() {
    handleClickEvents();
}

function handleClickEvents() {
    updateBottombar();
    deleteRecipe();
    updateRecipe();
    openModal();
}

function openModal() {
    const elements = document.querySelectorAll('.js-open-modal');
    elements.forEach((elem) => {
        elem.addEventListener('click', async () => {
            const {id} = elem.dataset;
            let content = await fetch(`/api/recipes/renderrecipetile?id=${id}`);
            const modal = new tingle.modal({
                closeMethods: ['overlay', 'button', 'escape'],
            });
            content = await content.json();
            const div = document.createElement('div');
            div.innerHTML = content.html;
            modal.setContent(div);
            modal.open();
        });
    });
}

function updateBottombar() {
    const location = window.location.href.split('render/')[1];
    document.querySelector(`.bottombar-item.${location}`).classList.add('material-icons-active');
}

function updateRecipe() {
    document.querySelectorAll('.js-edit-recipe').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const {id} = btn.dataset;
            if (!id) return;

            let response = await fetch(`/api/recipes/renderupdateform?id=${id}`);
            response = await response.json();
            let elem = document.createElement('div');
            elem.innerHTML = response.html;
            modal.setContent(response.html);
            modal.open();
        });
    });
}

function deleteRecipe() {
    document.querySelectorAll('.js-delete-recipe').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const {id} = btn.dataset;
            if (!id) return;

            fetch(`/api/recipes?id=${id}`, {method: 'DELETE'});
            btn.parentElement.parentElement.remove();
        });
    });
}

function bindSubmitEvent() {
    const btns = document.querySelectorAll('.js-add-recipe-btn');
    
    btns.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const {action} = btn.dataset;
            const form = document.querySelector('.tingle-modal .js-form');
            const title = form.querySelector('.js-form-title').value;
            const tags = form.querySelector('.js-form-tags').value;
            const ingredients = form.querySelector('.js-form-ingredients').value;
            const for2days = form.querySelector('.js-form-for2days').checked;
            const price = form.querySelector('.js-form-price').value;
            const {id} = btn.dataset;

            let data = {
                title,
                tags,
                ingredients,
                for2days,
                price
            };

            if (id) {
                data.id = id;
            }

            data = getformattedData(data);

            const method = action === 'update' ? 'PATCH' : 'POST';
            let response = await fetch('/api/recipes', {
                method,
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            response = await response.json();

            if (response.success) {
                const message = action === 'update' ? 'Recipe Successfully Updated!' : 'Recipe Successfully Added!';
                modal.setContent(`<h3>${message}</h3>`);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                modal.setContent(`<h3>Error: ${response.error}</h3>`);
            }
        });
    });
}

function getformattedData(data) {
    const ingredients = data.ingredients.split(',');
    data.ingredients = ingredients;
    const tags = data.tags.split(',');
    data.tags = tags;
    return data;
}


