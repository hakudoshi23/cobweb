((function () {
    'use strict';

    var TNode = function (parent, data) {
        this.data = data || {};
        this.parent = parent;
        this.children = [];
    };

    TNode.prototype.isRoot = function () {
        return !this.parent;
    };

    TNode.prototype.add = function (data) {
        var child = new this.constructor(this, data);
        this.children.push(child);
        return child;
    };

    TNode.prototype.remove = function (index) {
        this.children.slice(index, 1);
        return this;
    };

    TNode.prototype.dfs = function (check) {
        var out = [];
        for (var i = 0; i < this.children.length; i++) {
            if (!check || (check && check(this.children[i])))
                out.push(this.children[i]);
            out.concat(this.children[i].dfs(check));
        }
        return out;
    };

    TNode.prototype.bfs = function (check) {
        var out = [], i;
        for (i = 0; i < this.children.length; i++)
            if (!check || (check && check(this.children[i])))
                out.push(this.children[i]);
        for (i = 0; i < this.children.length; i++)
            out.concat(this.children[i].bfs(check));
        return out;
    };

    window.tree = function (defaults) {
        var _TNode = function (parent, data) {
            TNode.call(this, parent, data);
        };
        _TNode.prototype = Object.create(TNode.prototype);
        _TNode.prototype.constructor = _TNode;
        extend(_TNode.prototype, defaults);
        return new _TNode(null);
    };
})());
