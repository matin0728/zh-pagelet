goog.provide('ZH.net.AbstractDependencyLoader')

goog.require('goog.events.EventTarget')

ZH.net.AbstractDependencyLoader = function() {
	goog.events.EventTarget.call(this)
}

goog.inherits(ZH.net.AbstractDependencyLoader, goog.events.EventTarget)

ZH.net.AbstractDependencyLoader.Events = {
	LOAD: 'load'
}

// Subclass should override this method.
ZH.net.AbstractDependencyLoader.prototype.load = function(dependencies) {
	this.dispatchEvent('load')
}

