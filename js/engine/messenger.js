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
		removeListener:function(signature,func,comp){
			this.eventTable[signature] = $.grep(this.eventTable[signature],function(e,i){
				return (func == e.func && comp == e.comp);
			},true);
		},
		broadcast:function(signature,parameter){
			if(this.eventTable[signature])
			{
				for(var i = 0; i < this.eventTable[signature].length; i++)
				{
					this.eventTable[signature][i].func.bind(this.eventTable[signature][i].comp)(parameter);
				}
			}
		}

	}



	return new Messenger;
}();