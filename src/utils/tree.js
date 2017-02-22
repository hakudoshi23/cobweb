((function () {
    'use strict';

    var TreeNode = function (parent, data) {
        this.parent = parent || null;
        this.data = data || {};
        this.children = [];
    };

    window.TreeNode = TreeNode;

    TreeNode.prototype.isRoot = function () {
        return !this.parent;
    };

    TreeNode.prototype.add = function (data) {
        var child = new this.constructor(this, data);
        this.children.push(child);
        return child;
    };

    TreeNode.prototype.remove = function (index) {
        this.children.slice(index, 1);
        return this;
    };

    TreeNode.prototype.dfs = function (check) {
        var out = [];
        for (var i = 0; i < this.children.length; i++) {
            if (!check || (check && check(this.children[i])))
                out.push(this.children[i]);
            out.concat(this.children[i].dfs(check));
        }
        return out;
    };

    TreeNode.prototype.bfs = function (check) {
        var out = [], i;
        for (i = 0; i < this.children.length; i++)
            if (!check || (check && check(this.children[i])))
                out.push(this.children[i]);
        for (i = 0; i < this.children.length; i++)
            out.concat(this.children[i].bfs(check));
        return out;
    };

    TreeNode.extend = function () {
        var _TreeNode = function (parent, data) {
            TreeNode.call(this, parent, data);
        };
        _TreeNode.prototype = Object.create(TreeNode.prototype);
        _TreeNode.prototype.constructor = _TreeNode;
        return new _TreeNode();
    };
})());
