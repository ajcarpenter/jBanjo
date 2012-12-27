var AABB = function(){
	var AABB = function(center,halfDimension){
		this.center = center;
		this.halfDimension = halfDimension;
	};

	AABB.prototype = {
		halfDimension:null,
		center:null,
		containsPoint:function(point){
			return (
				(point.elements[0] >= (this.center.elements[0] - this.halfDimension.elements[0]))
				&&
				(point.elements[0] <= (this.center.elements[0] + this.halfDimension.elements[0]))
				&&
				(point.elements[1] >= (this.center.elements[1] - this.halfDimension.elements[1]))
				&&
				(point.elements[1] <= (this.center.elements[1] + this.halfDimension.elements[1]))
			);
		},
		intersectsAABB:function(AABB){
			return (
				Math.abs(this.center.elements[0] - AABB.center.elements[0]) 
					<= (this.halfDimension.elements[0] + AABB.halfDimension.elements[0])
				&&
				Math.abs(this.center.elements[1] - AABB.center.elements[1]) 
					<= (this.halfDimension.elements[1] + AABB.halfDimension.elements[1])
			);
		}
	}

	return AABB;
}();

var QuadTree = function(){
	var QuadTree = function(boundary){
		this.boundary = boundary;
		this.points = [];
	};

	QuadTree.prototype = {
		QT_NODE_CAPACITY:4,
		NW_MATRIX:$M([[-1,0],[0,-1]]),
		NE_MATRIX:$M([[1,0],[0,-1]]),
		SW_MATRIX:$M([[-1,0],[0,1]]),
		SE_MATRIX:$M([[1,0],[0,1]]),
		boundary:null,
		points:null,//Stored as object {point:$V([x,y]),gameObject:gameObject}
		nw:null,
		ne:null,
		sw:null,
		se:null,
		insert:function(p){
			if(this.boundary.containsPoint(p.point))
			{
				if (this.points.length < this.QT_NODE_CAPACITY)
				{
					this.points.push(p);
					return true;
				}

				if(this.nw === null)
					this.subdivide();

				if(this.nw.insert(p)) return true;
				if(this.ne.insert(p)) return true;
				if(this.sw.insert(p)) return true;
				if(this.se.insert(p)) return true;
			}

			return false;
		},
		subdivide:function(){
			var halfDimension = this.boundary.halfDimension.x(0.25);
			var nwCenter = this.boundary.center.add(this.NW_MATRIX.x(halfDimension));
			var neCenter = this.boundary.center.add(this.NE_MATRIX.x(halfDimension));
			var swCenter = this.boundary.center.add(this.SW_MATRIX.x(halfDimension));
			var seCenter = this.boundary.center.add(this.SE_MATRIX.x(halfDimension));

			this.nw = new QuadTree(new AABB(nwCenter,halfDimension));
			this.ne = new QuadTree(new AABB(neCenter,halfDimension));
			this.sw = new QuadTree(new AABB(swCenter,halfDimension));
			this.se = new QuadTree(new AABB(seCenter,halfDimension));
		},
		queryRange:function(range){
			var pointsInRange = [];

			if(!this.boundary.intersectsAABB(range))
				return pointsInRange;

			for(var i = 0; i < this.points.length; i++)
			{
				if(range.containsPoint(this.points[i].point))
					pointsInRange.push(this.points[i]);
			}

			if(this.ne === null)
				return pointsInRange;

			pointsInRange.concat(this.nw.queryRange(range));
			pointsInRange.concat(this.ne.queryRange(range));
			pointsInRange.concat(this.sw.queryRange(range));
			pointsInRange.concat(this.se.queryRange(range));

			return pointsInRange;
		}
	};

	return QuadTree;
}();