var Messenger = function(){
	var Messenger = function(){

	};

	Messenger.prototype = {
		eventTable:{
			//signature:[delegates]
		},
		addListener:function(signature,func,component){
			if(!this.eventTable[signature])
				this.eventTable[signature] = [];

			this.eventTable[signature].push({func:func,comp:component});
		},
		removeListener:function(signature,func){
			this.eventTable[signature].splice(this.eventTable[signature].indexOf(func),1);
		},
		broadcast:function(signature,parameter){
			if(this.eventTable[signature])
			{
				for(var i in this.eventTable[signature])
				{
					this.eventTable[signature][i].func.bind(this.eventTable[signature][i].comp)(parameter);
				}
			}
		}

	}



	return new Messenger;
}();