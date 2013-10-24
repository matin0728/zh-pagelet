define(function(require, exports) {

	<%= compiledCode %>

	;;ZH.dependencyTree = null
	ZH.parentChildMap = null

  var registry = ZH.core.Registry.getInstance();
	ZH.initNodeTree = function(currentNodeId, parentId) {
		var element = goog.dom.getElement(currentNodeId)

    if (!element) {
      throw new Error('No element found for:' + currentNodeId)
    }

    goog.array.forEach(ZH.parentChildMap[parentId], function(entry, index) {
      if (entry['id'] === currentNodeId) {
        //we got the info for this node.
        var nodeConstructor = registry.getConstructor(entry['js'])
        var instance_;
        if (nodeConstructor) {
          instance_ = nodeConstructor.createInstance?nodeConstructor.createInstance():null;

          //this type is Singleton.
          if (!instance_) {
            instance_ = nodeConstructor.getInstance?nodeConstructor.getInstance():null;
          }

          if (!instance_ && goog.isFunction(nodeConstructor)) {
            instance_ = new nodeConstructor(); 
          }

        }

        if (instance_) {
          instance_.decorate(element)
        } else {
          throw new Error('Can not create instance for type: ' + entry['js'])
        }
      }
    })
	}

  ZH.initComponent = function(dependencyTree, parentChildMap) {
  	ZH.dependencyTree = dependencyTree
		ZH.parentChildMap = parentChildMap
  	if (console) {
  		console.log('init component loaded in !!!!')
  	}

  	for (k in dependencyTree) {
  		if (dependencyTree.hasOwnProperty(k)){
  			var deps = dependencyTree[k];
  			//get all deps for a tre.
  			var rootElementId = k;
  			require.async(deps, goog.partial(function(rootElementId, parentId){
  				ZH.initNodeTree(rootElementId, parentId)
  			}, rootElementId, 'ROOT'))
  		}
  	}
  }

  exports.ZH = ZH;
  exports.goog = goog;
})