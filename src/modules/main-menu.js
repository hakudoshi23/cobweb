((function () {
    'use strict';

    Modules.prototype.add('main-menu', function (instance) {
        var container = document.querySelector(instance.options.container.selector);

        var cobwebFile = document.querySelector('#cobweb-file');
        cobwebFile.addEventListener('change', handleMeshFileSelected);

        var mainMenu = document.createElement('div');
        mainMenu.className = 'main-menu';

        mainMenu.appendChild(buildButton('Toggle Help', function () {
            var helpContainer = document.querySelector('#surface-help');
            if (helpContainer.style.display) {
                helpContainer.style.display = '';
            } else helpContainer.style.display = 'none';
        }));

        mainMenu.appendChild(buildButton('Download Object', function () {
            //TODO: build output file in OBJ format
        }));

        mainMenu.appendChild(buildButton('Upload Object', function () {
            if (instance.scene.children.length > 0) {
                var sure = confirm('The current mesh will be removed. Are you sure?');
                if (!sure) return;
            }
            instance.scene.children = [];
            if (window.FileReader) {
                cobwebFile.click();
            } else {
                alert('window.FileReader is undefined, File API not present!');
            }
        }));

        container.insertBefore(mainMenu, container.firstChild);

        function handleMeshFileSelected (event) {
            var files = event.target.files;
            if (files.length > 0) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var mesh = instance.asset.mesh.build(e.target.result);
                    instance.scene.addObject({mesh: mesh});
                };
                reader.readAsText(files[0]);
            }
        }
    });

    function buildButton (name, clickCallback) {
        var button = document.createElement('button');
        button.style.marginLeft = '5px';
        button.innerHTML = name;
        button.onclick = clickCallback;
        return button;
    }
})());
