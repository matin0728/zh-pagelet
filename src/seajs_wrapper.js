define(function(require, exports) {
	{{distributedCode}}

	  // if in seajs invironment
  ZH.initComponent = function(rootNodesMap, parentChildMap) {
  	if (console) {
  		console.log('init component invoke.')
  	}
  }

  // Export the interface for other compoment.
  exports.ZH = ZH;
  exports.goog = goog;
})