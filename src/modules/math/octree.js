(function () {
	'use strict';

	var defaultOptions = {
		maxItems: 50,
		maxDepth: 5,
		padding: 0.1
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

	OctreeNode.prototype.removeItem = function (item) {
		var removed = false;
		var index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
			this.mergeIfNeeded();
			removed = true;
		} else {
			if (this.children) {
				for (var i = 0; i < this.children.length; i++) {
					removed |= this.children[i].removeItem(item);
					if (removed) break;
				}
			}
		}
		if (removed) this.mergeIfNeeded();
		return removed;
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

	OctreeNode.prototype.mergeIfNeeded = function () {
		//console.debug('mergeIfNeeded');
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
		var half = [0, 0, 0];
		vec3.sub(half, parentAabb.max, parentAabb.min);
		vec3.scale(half, half, 0.5);
		var ref = [!(index & 1), !(index & 2), !(index & 4)];
		vec3.mul(this.aabb.min, half, ref);
		vec3.add(this.aabb.min, this.aabb.min, parentAabb.min);
		vec3.add(this.aabb.max, this.aabb.min, half);
		if (this.children)
			for (var i = 0; i < this.children.length; i++)
				this.children[i].updateDimensions(this.aabb, i);
	};

	var Octree = function (options) {
		this.options = Object.assign({}, defaultOptions, options);
		OctreeNode.call(this);
	};

	Octree.prototype = Object.create(OctreeNode.prototype);
	Octree.prototype.constructor = OctreeNode;

	var _addItems = Octree.prototype.addItems;
	Octree.prototype.addItems = function (items) {
		this.updateBounds(items);
		_addItems.call(this, items);
	};

	Octree.prototype.onVertexMove = function (item) {
		this.updateDimensions();
		if (this.removeItem(item)) this.addItem(item);
	};

	Octree.prototype.updateDimensions = function (newItems) {
		var allItems = this.getAllItems();
		if (newItems) allItems.push(newItems);
		this.updateBounds(allItems);
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].updateDimensions(this.aabb, i);
			}
		}
	};

	Octree.prototype.updateBounds = function (items) {
		var max = [0, 0, 0].fill(-Number.MAX_VALUE);
		var min = [0, 0, 0].fill(Number.MAX_VALUE);
		var padding = this.options.padding;
		items.forEach(function (item) {
			for (var j = 0; j < 3; j++) {
				min[j] = Math.min(min[j], item[j] - padding);
				max[j] = Math.max(max[j], item[j] + padding);
			}
		});
		vec3.copy(this.aabb.min, min);
		vec3.copy(this.aabb.max, max);
	};

	Math.Octree = Octree;

	function isContained (item, aabb) {
		for (var j = 0; j < 3; j++) {
			if (item[j] < aabb.min[j]) return false;
			if (item[j] > aabb.max[j]) return false;
		}
		return true;
	}
})();
