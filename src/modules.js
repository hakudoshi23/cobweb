((function () {
    'use strict';

    var Modules = function (params, callbacks) {
        callbacks = callbacks || {};
        var modules = Modules.prototype.all;
        try {
            var sortedNames = topologicalSort(modules);
            for (var i = 0; i < sortedNames.length; i++ ) {
                var name = sortedNames[i];
                var module = modules[name];
                try {
                    module.init.apply(this, params);
                    runCallback(callbacks, 'onLoaded', [name, module]);
                } catch (ex) {
                    console.error('Error loading module:', name, ex);
                    runCallback(callbacks, 'onError', [ex, name, module]);
                }
            }
            runCallback(callbacks, 'onLoadedAll', [sortedNames]);
        } catch (ex) {
            console.error('Error loading modules:', ex);
        }
    };

    Modules.prototype.all = {};
    Modules.prototype.add = function (name, init, dependencies) {
        dependencies = dependencies || [];

        var dependant = [];
        var dependencyModule, i;
        for (var moduleName in this.all) {
            var module = this.all[moduleName];
            for (i = 0; i < module.dependencies.length; i++)
                if (module.dependencies[i] === name)
                    dependant.push(moduleName);
        }
        for (i = 0; i < dependencies.length; i++) {
            dependencyModule = this.all[dependencies[i]];
            if (dependencyModule) dependencyModule.dependant.push(name);
        }

        this.all[name] = {
            dependencies: dependencies,
            dependant: dependant,
            init: init
        };
    };

    window.Modules = Modules;

    function topologicalSort (modules) {
        var sortedNames = [];

        var module = null, i = 0;
        for (var name in modules) {
            module = modules[name];
            for (i = 0; i < module.dependencies.length; i++) {
                var depName = module.dependencies[i];
                if (!modules[depName])
                    throw new Error('Missing module: ' + depName);
            }
        }

        var nextName = null;
        var candidates = getInitialCandidates(modules);
        while (candidates.length > 0) {
            nextName = candidates.splice(0, 1)[0];
            module = modules[nextName];
            if (module) {
                sortedNames.push(nextName);
                for (i = 0; i < module.dependant.length; i++) {
                    var dependantName = module.dependant[i];
                    if (allDependenciesMet(sortedNames, modules[dependantName]))
                        candidates.push(dependantName);
                }
            }
        }

        if (Object.keys(modules).length !== sortedNames.length)
            throw new Error('Dependency cycle!');

        return sortedNames;
    }

    function getInitialCandidates (modules) {
        var candidates = [];
        for (var name in modules)
            if (modules[name].dependencies.length === 0)
                candidates.push(name);
        return candidates;
    }

    function allDependenciesMet (loadedUntilNow, module) {
        for (var i = 0; i < module.dependencies.length; i++)
            if (loadedUntilNow.indexOf(module.dependencies[i]) === -1) return false;
        return true;
    }

    function runCallback (callbacks, name, params) {
        var callback = callbacks[name];
        var isFunction = typeof callback === 'function';
        if (isFunction) callback.apply(null, params);
    }
})());
