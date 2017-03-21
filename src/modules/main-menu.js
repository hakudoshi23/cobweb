((function () {
    'use strict';

    Modules.prototype.add('main-menu', function (instance) {
        var container = document.querySelector(instance.options.container.selector);

        var mainMenu = document.createElement('div');
        mainMenu.className = 'main-menu';

        mainMenu.innerHTML = 'Main Menu -- ';
        mainMenu.innerHTML += 'Item1';
        mainMenu.innerHTML += 'Item2';
        mainMenu.innerHTML += 'Item3';

        container.insertBefore(mainMenu, container.firstChild);
    });
})());
