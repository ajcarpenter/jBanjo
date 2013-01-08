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

var RTree = function(){
	var RTree = function(){

	};

	RTree.prototype = {

	};

	return RTree;
}();