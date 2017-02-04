((function () {
    'use strict';

    Cobweb.prototype.modules = {
        all: {},
        add: function (name, init, dependencies) {
            dependencies = dependencies || [];
            
            this.all[name] = {
                dependencies: dependencies,
                init: init
            };
        },
        load: function (instance) {
            addReverseDependencies(this.all);
            var sortedNames = topologicalSort(instance, this.all);
            for (var i = 0; i < sortedNames.length; i++ ) {
                var name = sortedNames[i];
                try {
                    this.all[name].init(instance);
                    instance.events.trigger('modules.loaded', name);
                } catch (ex) {
                    instance.logger.error('Loading module ' + name, ex);
                    instance.events.trigger('modules.error', name, ex);
                }
            }
            instance.events.trigger('modules.loaded.all', sortedNames);
        }
    };

    function addReverseDependencies (modules) {
        for (var name in modules) {
            var module = modules[name];
            if (!module.dependant) module.dependant = [];
            if (module.dependencies.length > 0) {
                for (var i = 0; i < module.dependencies.length; i++) {
                    var depPlugin = modules[module.dependencies[i]];
                    if (!depPlugin.dependant) depPlugin.dependant = [];
                    depPlugin.dependant.push(name);
                }
            }
        }
    }

    function topologicalSort (instance, modules) {
        var candidates = [], sortedNames = [];
        for (var name in modules)
            if (modules[name].dependencies.length === 0)
                candidates.push(name);
        while (candidates.length > 0) {
            var nextName = candidates[0];
            candidates.splice(0, 1);
            if (modules[nextName]) {
                var module = modules[nextName];
                sortedNames.push(nextName);
                for (var i = 0; i < module.dependant.length; i++) {
                    var depName = module.dependant[i];
                    if (allDependenciesMet(sortedNames, modules[depName]))
                        candidates.push(depName);
                }
            } else {
                instance.events.trigger('modules.error.missing', nextName);
                instance.logger.warning('Missing module \'' + nextName + '\'');
            }
        }
        if (Object.keys(modules).length !== sortedNames.length) {
            instance.events.trigger('modules.error.cycle');
            instance.logger.error('Dependency cycle found in modules');
        }
        return sortedNames;
    }

    function allDependenciesMet (loadedUntilNow, module) {
        for (var i = 0; i < module.dependencies.length; i++)
            if (loadedUntilNow.indexOf(module.dependencies[i]) === -1) return false;
        return true;
    }
})());
