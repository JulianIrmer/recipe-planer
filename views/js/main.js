init();

function init() {
    updateBottombar();
}

function updateBottombar() {
    const value = getLocalStorage('bottombar-location');
    const elem = document.querySelector(`.bottombar-item.${value}`);
    if (!elem) return;

    elem.classList.add('material-icons-active');

    const bottombarItems = document.querySelectorAll('.bottombar-item');
    bottombarItems.forEach((item) => {
        item.addEventListener('click', () => {
            setLocalStorage('bottombar-location', item.dataset.location);
        });
    });
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorage(key) {
    const value = localStorage.getItem(key) || 'home';
    return value;
}


