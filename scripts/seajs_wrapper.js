define(function(require, exports) {

	<%= compiledCode %>

  var SeajsDependencyLoader = function() {
    ZH.net.AbstractDependencyLoader.call(this)
  }

  goog.inherits(ZH.net.AbstractDependencyLoader, goog.envents.EventTarget)

  SeajsDependencyLoader.prototype.load = function(dependencies) {
    require.async(dependencies, goog.bind(this.onLoad, this))
  }

  SeajsDependencyLoader.prototype.onLoad = function() {
    this.dispathEvent(ZH.net.AbstractDependencyLoader.Events.LOAD)
  }

  ZH.initComponent = function(deps, inforMap) {
    new PageletProcessor(new SeajsDependencyLoader(), new ZH.net.Pagelet({
      'dependency_tree': deps,
      'infor_map': inforMap
    }).process()
  }

  exports.ZH = ZH;
  exports.goog = goog;
})