define(function(require, exports) {

	<%= compiledCode %>

	// ;;ZH.dependencyTree = null
	// ZH.parentChildMap = null

  var PageletProcessor = function(pagelet) {
    this.pagelet = pagelet
    this.registry = ZH.core.Registry.getInstance()
    this.infoCache = {}
    // Default to need update dom, means insert/update dom node or send update message
    // for existing node.
    this.needDomUpdate_ = true
    this.callback_ = null
    this.processedCount_ = 0
    // store the root node reference, pass to callback function.
    this.rootNode_ = null
  }

  PageletProcessor.prototype.setCallback = function(callback) {
    this.callback_ = callback
  }

  PageletProcessor.prototype.initNodeTree = function(entryId) {
    //TBD: Load CSS file.
    
    var entry = null
      , isRoot = false

    if (!entryId) {
      // Should be root element.
      entryId = this.pagelet.getInforMap()['ROOT'][0]
      entry = this.infoCache[entryId]
      isRoot = true
    }

    var currentNodeId = entry['entry'] 
    var element = goog.dom.getElement(currentNodeId)

    if (!element) {
      throw new Error('Can not find element for: ' + currentNodeId + '@' + entry['js'])
    }

    //we got the info for this node.
    var nodeConstructor = this.registry.getConstructor(entry['js'])
    var instance_;
    if (nodeConstructor) {
      instance_ = nodeConstructor.createInstance?nodeConstructor.createInstance():null;

      //this type is Singleton.
      if (!instance_) {
        instance_ = nodeConstructor.getInstance?nodeConstructor.getInstance():null;
      }

      if ( !instance_ && goog.isFunction(nodeConstructor) ) {
        instance_ = new nodeConstructor(entry['meta'])
      }

    }

    if (instance_) {
      instance_.setId(currentNodeId)
      instance_.decorate(element)

      if (isRoot) {
        this.rootNode_ = instance_
      }

      this.processedCount_ += 1
      //check if all node is be processed.
      if (this.processedCount_ >= this.pagelet.getTotalNodeCount()) {
        this.callback_ && this.callback_(this.rootNode_)
      }

      // Check if has any child node.
      var map = this.pagelet.getInforMap()
      if (map[currentNodeId]) {
        var count = map.length;
        for (var k = 0;k < count;k++) {
          arguments.callee(map[k])  
        }
      } 
    }
  }

  PageletProcessor.prototype.renderWithDecoration_ = function() {
    var referElement = goog.dom.getElement(this.pagelet.getReferNode())
    if (!referElement) {
      throw new Error('Can not find refer element.')
    }

    var domElement = goog.dom.htmlToDocumentFragment(ZH.core.uti.trim(this.pagelet.getHtml())

    //IMPORTANAT: if this is not a element but documentFragment node.
    //Normally, any extra line break or comments outside 
    //elements html code should be stripped in template.
    if(domElement.nodeType != 1 && domElement.childNodes){
        domElement = goog.array.find(domElement.childNodes, function(el){
            //return firt element node.
            return el.nodeType == 1;
        });
    }
    
    if(!domElement || domElement.nodeType != 1){
        throw Error('Dom creation fail.');
    }

    var position = this.pagelet.getRenderPosition()
    if (position === ZH.net.Pagelet.RenderPosition.APPEND){
        goog.dom.appendChild(referElement, domElement);
    } else if (position === ZH.net.Pagelet.RenderPosition.BEFORE){
        goog.dom.insertSiblingBefore(domElement, referElement);
    } else if (position === ZH.net.Pagelet.RenderPosition.AFTER 
      || position === ZH.net.Pagelet.RenderPosition.REPLACE) {
        goog.dom.insertSiblingAfter(domElement, referElement);
    }

    //remove ref node if is replacement.
    if (position === ZH.net.Pagelet.RenderPosition.REPLACE) {
      goog.dom.removeNode(referElement)
    }
  }

  PageletProcessor.prototype.unRenderOldNode_ = function() {
    var instance_ = this.registry.getInstanceById(this.pagelet.getTargetClass(), 
      this.pagelet.getTargetClientId())
    if(!instance_){
      throw new Error('Invalid instance to un_render.')
    }

    var p = instance_.getParent();
    if(p){
        p.removeChild(instance_, true);
    }else{
        instance_.exitDocument();
        if (instance_.element_) {
          goog.dom.removeNode(instance_.element_);
        }
    }
  }

  PageletProcessor.prototype.updateNode_ = function() {
    var instance_ = this.registry.getInstanceById(this.pagelet.getTargetClass(), 
      this.pagelet.getTargetClientId())

    if (instance_) {
      var message = this.pagelet.getMessage()
      var model
      if (message) {
        model = message['model']
      }
      instance_.liveUpdate(this.pagelet.getHtml(), model )
    } else {
      throw new Error('Invalid node to update.')
    }
  }

  PageletProcessor.prototype.process = function() {
    var renderType = this.pagelet.getRenderType()
    if ( renderType === ZH.net.Pagelet.RenderType.DECORATION ) {
      this.renderWithDecoration_()
    } else if ( renderType === ZH.net.Pagelet.RenderType.UPDATING ) {
      this.updateNode_()
    } else if ( renderType === ZH.net.Pagelet.RenderType.UN_RENDER ) {
      this.unRenderOldNode_()
      return
    }

    var deps = []
    goog.array.forEach(this.pagelet.getDependencyTree(), function(item) {
      deps.push(item['js'])
      this.infoCache[item['id']] = item
    })

    require.async(deps, goog.bind(function(){
      this.initNodeTree()
    }, this))
  }  


	// ZH.initNodeTree = function(entry) {
 //    var currentNodeId = entry['id']
 //    var element = goog.dom.getElement(currentNodeId)
 //    if (!element) {
 //      throw new Error('Can not find element for: ' + currentNodeId + '@' + entry['js'])
 //    }
 //    //we got the info for this node.
 //    var nodeConstructor = registry.getConstructor(entry['js'])
 //    var instance_;
 //    if (nodeConstructor) {
 //      instance_ = nodeConstructor.createInstance?nodeConstructor.createInstance():null;

 //      //this type is Singleton.
 //      if (!instance_) {
 //        instance_ = nodeConstructor.getInstance?nodeConstructor.getInstance():null;
 //      }

 //      if ( !instance_ && goog.isFunction(nodeConstructor) ) {
 //        //TODO: Init with config options.
 //        instance_ = new nodeConstructor(entry['meta'])
 //      }

 //    }

 //    if (instance_) {
 //      instance_.setId(currentNodeId)
 //      instance_.decorate(element)
 //      // Check if has any child node.
 //      if (ZH.parentChildMap[currentNodeId]) {
 //        var next = ZH.parentChildMap[currentNodeId];
 //        var count = next.length;
 //        for (var k = 0;k < count;k++) {
 //          arguments.callee(next[k])  
 //        }
 //      } 
 //    }

	// }

  ZH.initComponent = function(deps, inforMap) {
    new PageletProcessor(new ZH.net.Pagelet({
      'dependency_tree': deps,
      'infor_map': inforMap
    }).process()
  }
  // ZH.initComponent = function(dependencyTree, parentChildMap) {
  // 	ZH.dependencyTree = dependencyTree
		// ZH.parentChildMap = parentChildMap

  // 	for (k in dependencyTree) {
  // 		if (dependencyTree.hasOwnProperty(k)) {
  // 			var deps = dependencyTree[k];
  // 			//get all deps for a tree.
  // 			var rootElementId = k;
  //       var nodeInfo = goog.array.find(ZH.parentChildMap['ROOT'], function(entry){
  //         return entry['id'] === rootElementId
  //       })
  // 			require.async(deps, goog.partial(function(info){
  // 				ZH.initNodeTree(info)
  // 			}, goog.object.clone(nodeInfo)))
  // 		}
  // 	}
  // };

  exports.ZH = ZH;
  exports.goog = goog;
})