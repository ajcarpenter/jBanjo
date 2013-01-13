var GameObject = function(){
	var GameObject = function(prefab,paramMap){
		this.paramMap = paramMap;
		this.components = [];
		this.childObjects = [];

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
			draw:function(drawBatch,parentTransform){
				var trans = this.transform.toWorld(parentTransform);

				for(var i = 0; i < this.drawable.length; i++)
				{
					this.components[i].draw(drawBatch,trans);
				}

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].drawable.length > 0)
						this.childObjects[i].draw(drawBatch,trans);
				}

				return drawBatch;
			},
			load:function(loadInitiator){
				this.loading = [];
				this.loadInitiator = loadInitiator;

				for(var i = 0; i < this.components.length; i++)
				{
					if(this.components[i].load)
					{
						this.components[i].load(this);
						this.loading.push(this.components[i]);
					}
				}

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].loadable)
					{
						this.childObjects[i].load(this);
						this.loading.push(this.childObjects[i]);
					}
				}
			},
			registerLoad:function(loadedObject){
				this.loading.splice(this.loading.indexOf(loadedObject),1);

				if(this.loading.length === 0)
					this.loadInitiator.registerLoad(this);
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