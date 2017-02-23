(function () {
	'use strict';

	var defaultOptions = {
		maxItems: 5,
		maxDepth: 5,
	};

	var OctreeNode = function (parent, depth, aabb) {
		this.items = [];
		this.children = null;
		this.depth = depth || 0;
		this.parent = parent || null;
		this.aabb = aabb || { max: [0, 0, 0], min: [0, 0, 0] };

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
			var half = [
				(this.aabb.max[0] - this.aabb.min[0]) * 0.5,
				(this.aabb.max[1] - this.aabb.min[1]) * 0.5,
				(this.aabb.max[2] - this.aabb.min[2]) * 0.5
			];
			this.children = [];
			for (var i = 0; i < 8; i++) {
				var aabb = Object.create(this.aabb);
				var ref = [!(i & 1), !(i & 2), !(i & 4)];
				aabb.min = [
					this.aabb.min[0] + half[0] * ref[0],
					this.aabb.min[1] + half[1] * ref[1],
					this.aabb.min[2] + half[2] * ref[2]
				];
				aabb.max = [
					aabb.min[0] + half[0],
					aabb.min[1] + half[1],
					aabb.min[2] + half[2]
				];
				this.children[i] = new OctreeNode(this, this.depth + 1, aabb);
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
