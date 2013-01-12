var Prefab = function(){
	var Prefab = function(components,children){
		this.components = new Array();
		this.childObjects = new Array();

		this.drawable = [];

		if(components)
		{
			for(var i = 0; i < components.length; i++)
			{
				this.addComponent(components[i]);
			}
		}

		this.addComponent(new Transform());

		if(children)
			this.childObjects = children;
	};
	
	Prefab.prototype = {
		components:null,
		childObjects:null,
		drawable:null,
		updateable:false,
		loadable:false,
		startable:false,
		stoppable:false,
		tags:[],
		instantiate:function(paramMap){
			//paramMap = {componentName:{paramName:value}}
			
			return new GameObject(this,paramMap);
		},
		getComponentByType:function(componentType){
			for(var i = 0; i < this.components.length; i++)
			{
				if(this.components[i].type == componentType)
					return this.components[i];
			}
			return null;
		},
		addComponent:function(component){
			if(!this.updateable && component.update)
				this.updateable = true;

			if(component.draw)
				this.drawable.push(component);

			if(!this.loadable && component.load)
				this.loadable = true;

			if(!this.startable && component.start)
				this.startable = true;

			if(!this.stoppable && component.stop)
				this.stoppable = true;

			this.components.push(component);

			return component;
		},
		disableComponent:function(i)
		{


		},
		enableComponent:function(i)
		{

		},
		addTag:function(tag){
			if(!this.tags)
				this.tags = [];

			this.tags.push(tag);
		},
		removeTag:function(tag)
		{
			
		}
	};
	
	return Prefab;
}();