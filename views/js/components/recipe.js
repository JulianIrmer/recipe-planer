init();

function init() {
    deleteRecipe();
}

function deleteRecipe() {
    const btns = document.querySelectorAll('.js-delete-recipe');
    if (btns.length === 0) return;

    btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const {id} = btn.dataset;
            if (!id) return;
            const parent = btn.parentElement.parentElement;

            fetch(`/recipes/api?id=${id}`, {method: 'DELETE'});
            parent.classList.add('delete-right');
            parent.addEventListener('transitionend', () => {
                parent.remove();
            });
        });
    });
}