((function () {
    'use strict';

    var Plugins = function () {
        this.available = {};
    };

    Plugins.prototype.add = function (name, init, dependencies) {
        dependencies = dependencies || [];

        if (typeof name !== 'string') throw new Error('Parameter 1: expected string, found ' + typeof name);
        if (!Array.isArray(dependencies)) throw new Error('Parameter 2: expected array, found ' + typeof dependencies);
        if (typeof init !== 'function') throw new Error('Parameter 3: expected function, found ' + typeof init);

        this.available[name] = {
            dependencies: dependencies,
            init: init
        };
    };

    Plugins.prototype.load = function(instance) {
        instance.plugins = {};
        addReverseDependencies(this.available);
        var sortedNames = topologicalSort(instance, this.available);
        for (var i = 0; i < sortedNames.length; i++ ) {
            var name = sortedNames[i];
            //try {
                this.available[name].init(instance);
                instance.events.trigger('plugins.loaded', name);
            /*} catch (ex) {
                instance.logger.error('Loading plugin ' + name + ': ' + ex);
                instance.events.trigger('plugins.error', name, ex);
            }*/
        }
        instance.events.trigger('plugins.loaded.all', sortedNames);
    };

    Cobweb.prototype.plugins = new Plugins();

    function addReverseDependencies (plugins) {
        for (var name in plugins) {
            var plugin = plugins[name];
            if (!plugin.dependant) plugin.dependant = [];
            if (plugin.dependencies.length > 0) {
                for (var i = 0; i < plugin.dependencies.length; i++) {
                    var depPlugin = plugins[plugin.dependencies[i]];
                    if (!depPlugin.dependant) depPlugin.dependant = [];
                    depPlugin.dependant.push(name);
                }
            }
        }
    }

    function topologicalSort (instance, plugins) {
        var candidates = [], sortedNames = [];
        for (var name in plugins)
            if (plugins[name].dependencies.length === 0)
                candidates.push(name);
        while (candidates.length > 0) {
            var nextName = candidates[0];
            candidates.splice(0, 1);
            if (plugins[nextName]) {
                var plugin = plugins[nextName];
                sortedNames.push(nextName);
                for (var i = 0; i < plugin.dependant.length; i++) {
                    var depName = plugin.dependant[i];
                    if (allDependenciesMet(sortedNames, plugins[depName]))
                        candidates.push(depName);
                }
            } else {
                instance.events.trigger('plugins.error.missing', nextName);
                instance.logger.warning('Missing plugin \'' + nextName + '\'');
            }
        }
        if (Object.keys(plugins).length !== sortedNames.length) {
            instance.events.trigger('plugins.error.cycle');
            instance.logger.error('Dependency cycle found in plugins');
        }
        return sortedNames;
    }

    function allDependenciesMet (loadedUntilNow, plugin) {
        for (var i = 0; i < plugin.dependencies.length; i++)
            if (loadedUntilNow.indexOf(plugin.dependencies[i]) === -1) return false;
        return true;
    }
})());
