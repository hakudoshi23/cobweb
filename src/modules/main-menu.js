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
            if (instance.scene.children.length > 0) {
                var objString = meshToOBJString(instance.scene.children[0].data.mesh);
                download('export.obj', objString);
            }
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

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
            encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function meshToOBJString (mesh) {
        var result = '';
        console.debug(mesh);
        for (var i = 0; i < mesh.vertices.length; i++) {
            var v = mesh.vertices[i];
            result += 'v ';
            result += v[0] + ' ';
            result += v[1] + ' ';
            result += v[2] + '\r\n';
        }
        result += 's off\r\n';
        for (i = 0; i < mesh.faces.length; i++) {
            var f = mesh.faces[i];
            var nextHE = f.halfEdge;
            result += 'f ' + (nextHE.vertex._halfEdge.ownIndex + 1);
            while (nextHE.next != f.halfEdge) {
                nextHE = nextHE.next;
                result += ' ' + (nextHE.vertex._halfEdge.ownIndex + 1);
            }
            result += '\r\n';
        }
        return result;
    }

    function buildButton (name, clickCallback) {
        var button = document.createElement('button');
        button.style.marginLeft = '5px';
        button.innerHTML = name;
        button.onclick = clickCallback;
        return button;
    }
})());
