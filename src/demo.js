goog.provide('ZH.demo')

goog.require('goog.ui.Compnent')


ZH.demo = function(){
	this.name = 'demo_component'
};

goog.inherits( ZH.demo, goog.ui.Compnent)


ZH.demo.prototype.sayHello = function(){
	console.log(this.name)
}


