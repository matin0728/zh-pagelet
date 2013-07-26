goog.require('goog.ui.Component')

goog.provide('ZH.demo')


ZH.demo = function(){
	this.name = 'demo_component'
};

goog.inherits( ZH.demo, goog.ui.Component)


ZH.demo.prototype.sayHello = function(){
	console.log(this.name)
}







