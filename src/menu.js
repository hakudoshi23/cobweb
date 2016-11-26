'use strict';

((function(){
    WebMesh.prototype.plugins['menu'] = function(instance) {
        var container = document.createElement('DIV');
        container.addClass(instance.options.menu.className);
        instance.container.append(container);

        var menu = document.createElement('UL');
        container.append(menu);

        this.items = {
            'File': [
                {
                    'Load...': function() {
                        console.log('item click!');
                    }
                }
            ],
            'Alert!': function() {
                instance.events.trigger('logger.info', null, 'LOOK AT ME! O_O');
                window.setTimeout(function(){
                    instance.events.trigger('logger.info', null, 'STAPH!');
                }, 2000);
            },
            'Help': [
                {
                    'About WebMesh': function() {
                        console.log('About what?!');
                    }
                }
            ]
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

                menu.append(li);
            }
        };
        this.update();
    };
})());
