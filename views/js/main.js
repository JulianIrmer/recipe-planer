init();

function init() {
    updateBottombar();
}

function updateBottombar() {
    const location = window.location.pathname.split('/')[1];
    const elem = document.querySelector(`.bottombar-item.${location}`);
    if (!elem) return;

    elem.classList.add('material-icons-active');
}


