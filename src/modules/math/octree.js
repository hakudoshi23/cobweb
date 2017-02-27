(function () {
	'use strict';

	var defaultOptions = {
		maxItems: 5,
		maxDepth: 5,
	};

	var OctreeNode = function (parent, depth) {
		this.items = [];
		this.children = null;
		this.depth = depth || 0;
		this.parent = parent || null;
		this.aabb = { max: [0, 0, 0], min: [0, 0, 0] };

		this.root = this;
		while (this.root.parent !== null)
			this.root = this.root.parent;
	};

	OctreeNode.prototype.getAllItems = function () {
        if (!this.children) return this.items;
        else {
            var allItems = [];
            for (var i = 0; i < this.children.length; i++)
                allItems = allItems.concat(this.children[i].getAllItems());
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
			if (this.children) {
				for (var i = 0; i < 8; i++)
					if (this.children[i].addItem(item))
						return true;
			} else {
				this.items.push(item);
				this.splitIfNeeded();
				return true;
			}
		}
		return false;
	};

	OctreeNode.prototype.splitIfNeeded = function () {
		if (this.root.options.maxItems < this.items.length &&
			this.root.options.maxDepth >= this.depth) {
			this.children = [];
			for (var i = 0; i < 8; i++) {
				this.children[i] = new OctreeNode(this, this.depth + 1);
				this.children[i].updateDimensions(this.aabb, i);
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
		return isContained(item, this.aabb);
	};

	OctreeNode.prototype.getCollidingNodes = function (ray) {
		var nodes = [];
		var aabb = this.aabb;
		var collidingPoint = [0, 0, 0];
		if (Math.geo.rayAABBCollision(ray.start, ray.direction,
			this.aabb.min, this.aabb.max, collidingPoint)) {
			if (this.children) {
				for (var i = 0; i < this.children.length; i++) {
					var child = this.children[i];
					nodes = nodes.concat(child.getCollidingNodes(ray));
				}
			} else {
				nodes.push(this);
			}
		}
		return nodes;
	};

	OctreeNode.prototype.getCollidingItems = function (ray) {
		var items = [];
		this.getCollidingNodes(ray).forEach(function (node) {
			items = items.concat(node.items);
		});
		return items;
	};

	OctreeNode.prototype.updateDimensions = function (parentAabb, index) {
		var half = [
			(parentAabb.max[0] - parentAabb.min[0]) * 0.5,
			(parentAabb.max[1] - parentAabb.min[1]) * 0.5,
			(parentAabb.max[2] - parentAabb.min[2]) * 0.5
		];
		var ref = [!(index & 1), !(index & 2), !(index & 4)];
		this.aabb.min = [
			parentAabb.min[0] + half[0] * ref[0],
			parentAabb.min[1] + half[1] * ref[1],
			parentAabb.min[2] + half[2] * ref[2]
		];
		this.aabb.max = [
			this.aabb.min[0] + half[0],
			this.aabb.min[1] + half[1],
			this.aabb.min[2] + half[2]
		];
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
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].updateDimensions(this.aabb, i);
			}
		}
	};

	Octree.prototype.shrinkIfNeeded = function (allItems) {
		console.debug('shrinkIfNeeded');
	};

	Octree.prototype.growIfNeeded = function (allItems) {
		updateRootBounds(allItems, this.aabb);
	};

	Math.Octree = Octree;

	function isContained (item, aabb) {
		for (var j = 0; j < 3; j++) {
			if (item[j] < aabb.min[j]) return false;
			if (item[j] > aabb.max[j]) return false;
		}
		return true;
	}

	function updateRootBounds (items, aabb) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			for (var j = 0; j < 3; j++) {
				if (item[j] < aabb.min[j]) aabb.min[j] = item[j];
				if (item[j] > aabb.max[j]) aabb.max[j] = item[j];
			}
		}
	}
})();
