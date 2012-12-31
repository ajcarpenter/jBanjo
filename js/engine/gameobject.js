var GameObject = function(){
	var GameObject = function(prefab,paramMap){
		this.paramMap = paramMap;
		this.components = [];
		this.childObjects = [];

		if(prefab)
		{
			this.prefab = prefab;
			this.updateable = prefab.updateable;
			this.drawable = prefab.drawable;
			this.loadable = prefab.loadable;
			this.startable = prefab.startable;
			
			for(var i = 0; i < prefab.components.length; i++)
			{
				this.components[i] = prefab.components[i].instantiate(this,paramMap[prefab.components[i].type],this);
				this[this.components[i].type] = this.components[i]; //Alias
			}

			for(var i = 0; i < prefab.childObjects.length; i++)
			{
				this.childObjects[i] = prefab.childObjects[i].instantiate(paramMap.children[i]);
			}			
		}
		else
		{
			this[ComponentType.Transform] = new Transform();
			this.components = [this[ComponentType.Transform]];
		}
	};
	
	GameObject.prototype = {
			update:function(gameTime,collisionQT){
				for(var i = 0; i < this.components.length; i++)
				{
					if(this.components[i].update)
						this.components[i].update(gameTime,collisionQT);
				}

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].updateable)
						this.childObjects[i].update(gameTime,collisionQT);
				}
			},
			draw:function(drawBatch,parentTransform){
				var trans = this.transform.toWorld(parentTransform);

				for(var i = 0; i < this.components.length; i++)
				{
					if(this.components[i].draw)
						this.components[i].draw(drawBatch,trans);
				}

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].drawable)
						this.childObjects[i].draw(drawBatch,trans);
				}

				return drawBatch;
			},
			start:function(){
				for(var i = 0; i < this.components.length; i++)
				{
					if(this.components[i].start)
						this.components[i].start(this);
				}

				for(var i = 0; i < this.childObjects.length; i++)
				{
					if(this.childObjects[i].startable)
						this.childObjects[i].start();
				}
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
			}

	};

	_inherit(GameObject,Prefab);

	return GameObject;
}();