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

var Collision = function(){
	var Collision = function(cellSize,queryRadius){
		this._cells = [];
		this.cellSize = cellSize;
		this.queryRadius = queryRadius;
	};

	Collision.prototype = {
		_cells:null,
		cellSize:null,
		queryRadius:null,
		add:function(gameObject,AABB){
			var cell = _getCell(AABB.center);

			if(!this._cells[cell.x])
				this._cells[cell.x] = [];

			if(!this._cells[cell.x][cell.y])
				this._cells[cell.x][cell.y] = [];			

			this._cells[cell.x][cell.y].push({obj:gameObject,AABB:AABB});
		},
		getCollisions:function(gameObject,AABB){
			var collidingWith = [];

			var cell = _getCell(AABB.center);

			for(var i = cell.x - this.queryRadius; i < cell.x + this.queryRadius; i++)
			{
				for(var j = cell.y - this.queryRadius; j < cell.y + this.queryRadius; j++)
				{
					if(this._cells[i][j])
					{
						for(var k = 0; k < this._cells[i][j].length; k++)
						{
							if(this._cells[i][j][k].obj != gameObject && AABB.intersectsAABB(this._cells[i][j][k].AABB))
							{
								collidingWith.push(this._cells[i][j][k].obj);
							}
						}
					}
				}
			}

			return collidingWith;
		},
		reset:function(){
			cells:[];
		},
		_getCell:function(position){
			return {
				x:Math.floor(position.elements[0] / this.cellSize.x),
				y:Math.floor(position.elements[1] / this.cellSize.y)
			};
		}


	}

	return Collision;
}();