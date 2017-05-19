((function () {
    'use strict';

    Modules.prototype.add('footer', function (instance) {
        var container = document.querySelector(instance.options.container.selector);

        var footer = document.createElement('div');
        footer.className = 'footer';

        instance.footer = {
            reset: function () {
                footer.innerHTML = '';
            },
            add: function (text) {
                footer.innerHTML += text;
            }
        };

        container.insertBefore(footer, null);
    });
})());
