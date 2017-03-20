(function () {
	'use strict';

	var defaultOptions = {
		maxItems: 20,
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

	OctreeNode.prototype.getAllItems = function (container) {
		container = container || [];
		var i;
        if (!this.children) {
			container = container.concat(this.items);
		} else {
            for (i = 0; i < this.children.length; i++)
                container = this.children[i].getAllItems(container);
        }
		return container;
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
		if (this.canContain(item)) {
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
			this.root.options.maxDepth > this.depth) {
			this.children = [];
			for (var i = 0; i < 8; i++) {
				this.children[i] = new OctreeNode(this, this.depth + 1);
				this.children[i].updateDimensions(this.aabb, i);
			}
			this.redistributeItems(this.items);
			this.items = [];
		}
	};

	OctreeNode.prototype.mergeIfNeeded = function () {
		if (this.children) {
			var canMerge = false;
			for (var i = 0; i < 8; i++) {
				this.children[i].mergeIfNeeded();
				canMerge = !this.children[i].children;
				if (!canMerge) return false;
			}
			var subItems = this.getAllItems();
			if (this.root.options.maxItems > subItems.length) {
				this.children = null;
				this.redistributeItems(subItems);
				return true;
			} else return false;
		} else return false;
	};

	OctreeNode.prototype.canContain = function (item) {
		return canContain(item, this.aabb);
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

	OctreeNode.prototype.redistributeItems = function (items) {
		items = items || this.items;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var containingParent = findContainingParent(this, item);
			if (containingParent === null) {
				console.warn('Recomputing bounds...');
				this.root.updateDimensions([item]);
				containingParent = findContainingParent(this, item);
			}
			containingParent.addItem(item);
		}
	};

	var Octree = function (options) {
		this.options = Object.assign({}, defaultOptions, options);
		OctreeNode.call(this);
	};

	Octree.prototype = Object.create(OctreeNode.prototype);
	Octree.prototype.constructor = OctreeNode;

	var _addItem = Octree.prototype.addItem;
	Octree.prototype.addItem = function (item) {
		if (!this.canContain(item))
			this.updateDimensions([item]);
		return _addItem.call(this, item);
	};

	Octree.prototype.onVerticesMove = function (items) {
		for (var i = 0; i < items.length; i++)
			if (this.removeItem(items[i]))
				this.addItem(items[i]);
	};

	Octree.prototype.updateDimensions = function (newItems) {
		var allItems = this.getAllItems(newItems);
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

	function canContain (item, aabb) {
		for (var j = 0; j < 3; j++) {
			if (item[j] < aabb.min[j]) return false;
			if (item[j] > aabb.max[j]) return false;
		}
		return true;
	}

	function findContainingParent (current, item) {
		var result = current;
		while (result && !result.canContain(item))
			result = result.parent;
		return result;
	}
})();
