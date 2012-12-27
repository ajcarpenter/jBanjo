var ResourceType = {
	image:0,
	audio:1,
	json:3,
	text:4,
	video:5
};

var ResourceState = {
	notLoaded:0,
	loading:1,
	loaded:2
}

var ResourceManager = function(){
	var ResourceManager = function(){

	};

	ResourceManager.prototype = {
		resources:{
			//uri:{type:ResourceType,url:url,data:Data,callbacks:[],state:ResourceState}
		},
		get:function(srcType,src,callback){
			if(!this.resources[src])
			{
				this.resources[src] = {
					type:srcType,
					url:src,
					callbacks:[callback],
					state:ResourceState.notLoaded
				};
			}

			switch(this.resources[src].state)
			{
				case ResourceState.notLoaded:
					this.resources[src].state = ResourceState.loading;
					switch(this.resources[src].type)
					{
						case ResourceType.image:
							this._getImage(this.resources[src]);
							break;
						case ResourceType.json:
							this._getJSON(this.resources[src]);
							break;
					}
					break;
				case ResourceState.loading:
					this.resources[src].callbacks.push(callback);
					break;
				case ResourceState.loaded:
					callback(this.resources[src].data);
			}
		},
		_getImage:function(resource){
			var image = new Image();
			var self = this;

			image.onload = function(){
				self._onResponse(resource,this);
			}

			image.src = resource.url;
		},
		_getJSON:function(resource){
			var self = this;
			$.getJSON(resource.url,function(data){
				self._onResponse(resource,data);
			});
		},
		_onResponse:function(resource,data){
			resource.data = data;
			resource.state = ResourceState.loaded;

			for(var i = 0; i < resource.callbacks.length; i++)
			{
				resource.callbacks[i](resource.data);
			}
		}
	};

	return new ResourceManager;
}();