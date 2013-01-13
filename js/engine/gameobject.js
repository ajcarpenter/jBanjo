var GameObject = function(){
	var GameObject = function(prefab,paramMap){
		
		this.components = [];
		this.childObjects = [];
		this.paramMap = paramMap;
		this.drawable = [];

		if(prefab)
		{
			this.prefab = prefab;

			for(var i = 0; i < prefab.components.length; i++)
			{
				this[prefab.components[i].type] = this.addComponent(prefab.components[i].instantiate(this,paramMap[prefab.components[i].type],this));
			}

			for(var i = 0; i < prefab.childObjects.length; i++)
			{
				this.childObjects[i] = prefab.childObjects[i].instantiate(paramMap.children[i]);
			}			
		}
		else
		{
			this[ComponentType.Transform] = this.addComponent(new Transform());
		}
	};
	
	GameObject.prototype = {
			draw:function(drawBatch,parentTransform,bounds){
				var trans = this.transform.toWorld(parentTransform);

				// if(bounds.containsPoint(trans.position))
				// {
					for(var i = 0; i < this.drawable.length; i++)
					{
						this.components[i].draw(drawBatch,trans,bounds);
					}
				// }

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].drawable.length > 0)
						this.childObjects[i].draw(drawBatch,trans,bounds);
				}

				return drawBatch;
			},
			destroy:function(){
				for(var i = 0; i < this.components.length; i++)
				{
					this.components[i].destroy();
				}

				Messenger.broadcast('destroy object',this);
			}

	};

	_inherit(GameObject,Prefab);

	return GameObject;
}();