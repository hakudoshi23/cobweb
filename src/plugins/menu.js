'use strict';

((function(){
    var Menu = function(instance) {
        this.container = document.createElement('DIV');
        this.container.addClass(instance.options.menu.className);
        instance.container.append(this.container);

        var menu = document.createElement('UL');
        menu.addClass('main-menu');
        this.container.append(menu);

        this.items = {
            'File': {
                'Load...': function() {
                    console.log('item click!');
                }
            },
            'Alert!': function() {
                instance.events.trigger('logger.info', 'LOOK AT ME! O_O');
                window.setTimeout(function(){
                    instance.events.trigger('logger.info', 'STAPH!');
                }, 2000);
            },
            'Help': {
                'About WebMesh': function() {
                    console.log('About what?!');
                }
            }
        };

        this.update = function() {
            for(var item in this.items){
                var li = document.createElement('LI');
                li.innerHTML = item;
                li.addClass(item);

                var value = this.items[item];
                if (typeof value === 'function') {
                    li.onclick = value;
                }

                var mainMenu = this.container.querySelector('.main-menu');
                mainMenu.append(li);
            }
        };

        this.update();
    };

    Cobweb.prototype.plugins.add('menu', Menu);
})());
