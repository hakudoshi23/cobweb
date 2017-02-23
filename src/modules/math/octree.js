(function () {
	'use strict';

	var defaultOptions = {
		maxItems: 5,
		maxDepth: 5,
	};

	var OctreeNode = function (parent, depth, bounds) {
		this.items = [];
		this.children = null;
		this.depth = depth || 0;
		this.parent = parent || null;
		this.bounds = bounds || { max: [0, 0, 0], min: [0, 0, 0] };

		this.root = this;
		while (this.root.parent !== null)
			this.root = this.root.parent;
	};

	OctreeNode.prototype.getAllItems = function () {
        if (!this.children) return this.items;
        else {
            var allItems = [];
            for (var i = 0; i < this.children.length; i++)
                allItems.push(this.children[i].getAllItems());
            return allItems;
        }
	};

	OctreeNode.prototype.addItems = function (items) {
		var result = false;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			result |= this.addItem(item);
		}
		return result;
	};

	OctreeNode.prototype.addItem = function (item) {
		if (this.contains(item)) {
			this.items.push(item);
			this.splitIfNeeded();
			return true;
		}
		return false;
	};

	OctreeNode.prototype.splitIfNeeded = function () {
		if (this.root.options.maxItems < this.items.length &&
			this.root.options.maxDepth >= this.depth) {
			var half = [
				(this.bounds.max[0] - this.bounds.min[0]) * 0.5,
				(this.bounds.max[1] - this.bounds.min[1]) * 0.5,
				(this.bounds.max[2] - this.bounds.min[2]) * 0.5
			];
			this.children = [];
			for (var i = 0; i < 8; i++) {
				var bounds = Object.create(this.bounds);
				var ref = [!(i & 1), !(i & 2), !(i & 4)];
				bounds.min = [
					this.bounds.min[0] + half[0] * ref[0],
					this.bounds.min[1] + half[1] * ref[1],
					this.bounds.min[2] + half[2] * ref[2]
				];
				bounds.max = [
					bounds.min[0] + half[0],
					bounds.min[1] + half[1],
					bounds.min[2] + half[2]
				];
				this.children[i] = new OctreeNode(this, this.depth + 1, bounds);
			}
			while (this.items.length > 0) {
				var item = this.items.pop();
				for (i = 0; i < 8; i++) {
					var child = this.children[i];
					if (child.addItem(item)) break;
				}
			}
		}
	};

	OctreeNode.prototype.removeItem = function (item) {
		var index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
			this.mergeIfNeeded();
			return true;
		}
		return false;
	};

	OctreeNode.prototype.mergeIfNeeded = function () {
		//TODO: implement
	};

	OctreeNode.prototype.contains = function (item) {
		return isContained(item, this.bounds);
	};

	var Octree = function (options) {
		this.options = Object.assign({}, defaultOptions, options);
		OctreeNode.call(this);
	};

	Octree.prototype = Object.create(OctreeNode.prototype);
	Octree.prototype.constructor = OctreeNode;

	var _addItems = Octree.prototype.addItems;
	Octree.prototype.addItems = function (items) {
		this.growIfNeeded(items);
		_addItems.call(this, items);
	};

	Octree.prototype.updateDimensions = function (newItems) {
		var allItems = this.getAllItems();
		if (newItems) allItems.push(newItems);
		this.shrinkIfNeeded(allItems);
		this.growIfNeeded(allItems);
	};

	Octree.prototype.shrinkIfNeeded = function (allItems) {
		console.debug('shrinkIfNeeded');
	};

	Octree.prototype.growIfNeeded = function (allItems) {
		updateRootBounds(allItems, this.bounds);
	};

	Math.Octree = Octree;

	function isContained (item, bounds) {
		for (var j = 0; j < 3; j++) {
			if (item[j] < bounds.min[j]) return false;
			if (item[j] > bounds.max[j]) return false;
		}
		return true;
	}

	function updateRootBounds (items, bounds) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			for (var j = 0; j < 3; j++) {
				if (item[j] < bounds.min[j]) bounds.min[j] = item[j];
				if (item[j] > bounds.max[j]) bounds.max[j] = item[j];
			}
		}
	}
})();
