//Function to enable inheritence
var _inherit = function(derived, base) {    
    // Create an instance of the base class to act as a prototype
    var tempConstructor = function(){};
    tempConstructor.prototype = base.prototype;
    var newPrototype = new tempConstructor();
    
    // Add _base and _super to the new prototype
    newPrototype._base = base.prototype;
    newPrototype._super = base;
    
    // Assign the new prototype
    for(var p in newPrototype)
    {
    	if(!derived.prototype[p])
    		derived.prototype[p] = newPrototype[p];
    }
    //derived.prototype = newPrototype;
};