define(function(require, exports) {

	<%= compiledCode %>

	;;ZH.dependencyTree = null
	ZH.parentChildMap = null

  var registry = ZH.core.Registry.getInstance();
	ZH.initNodeTree = function(entry) {
    var currentNodeId = entry['id']
    var element = goog.dom.getElement(currentNodeId)
    if (!element) {
      throw new Error('Can not find element for: ' + currentNodeId + '@' + entry['js'])
    }
    //we got the info for this node.
    var nodeConstructor = registry.getConstructor(entry['js'])
    var instance_;
    if (nodeConstructor) {
      instance_ = nodeConstructor.createInstance?nodeConstructor.createInstance():null;

      //this type is Singleton.
      if (!instance_) {
        instance_ = nodeConstructor.getInstance?nodeConstructor.getInstance():null;
      }

      if ( !instance_ && goog.isFunction(nodeConstructor) ) {
        instance_ = new nodeConstructor(
          // This trusted source.
          goog.json.unsafeParse(element.getAttribute('data-meta') || '{}')
          , goog.json.unsafeParse(element.getAttribute('data-options') || '{}')
          );
      }

    }

    if (instance_) {
      instance_.decorate(element)
      // Check if has any child node.
      if (ZH.parentChildMap[currentNodeId]) {
        var next = ZH.parentChildMap[currentNodeId];
        var count = next.length;
        for (var k = 0;k < count;k++) {
          arguments.caller.callee(next[k])  
        }
      } 
    } else {
      throw new Error('Can not create instance for type: ' + entry['js'])
    }

	}

  ZH.initComponent = function(dependencyTree, parentChildMap) {
  	ZH.dependencyTree = dependencyTree
		ZH.parentChildMap = parentChildMap

  	for (k in dependencyTree) {
  		if (dependencyTree.hasOwnProperty(k)){
  			var deps = dependencyTree[k];
  			//get all deps for a tree.
  			var rootElementId = k;
        var nodeInfo = goog.array.find(ZH.parentChildMap['ROOT'], function(entry){
          return entry['id'] === rootElementId
        })
  			require.async(deps, goog.partial(function(info){
  				ZH.initNodeTree(info)
  			}, goog.object.clone(nodeInfo))
  		}
  	}
  }

  exports.ZH = ZH;
  exports.goog = goog;
})