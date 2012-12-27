var input = function(){
	var input = function(){
		var self = this;

		$(window).keydown(function(e){self.setKey(e,self,true);});
		$(window).keyup(function(e){self.setKey(e,self,false);});
	};

	input.prototype = {
		keyStates:{},
		setKey:function(e,self,state){
			self.keyStates[e.which] = state;
		}
	};

	return new input;
}();