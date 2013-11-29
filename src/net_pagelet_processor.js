goog.provide('ZH.net.PageletProcessor')

goog.require('goog.events.EventHandler')
goog.require('goog.array')
goog.require('goog.dom')
goog.require('goog.object')
goog.require('ZH.net.Pagelet')
goog.require('ZH.core.Registry')
goog.require('ZH.core.uti')
goog.require('ZH.net.AbstractDependencyLoader')


ZH.net.PageletProcessor = function(dependencyLoader, pagelet) {
    this.pagelet_ = pagelet
    this.registry_ = ZH.core.Registry.getInstance()
    this.infoCache_ = {}
    // Default to need update dom, means insert/update dom node or send update message
    // for existing node.
    this.needDomUpdate_ = true
    this.callback_ = null
    this.processedCount_ = 0
    // store the root node reference, pass to callback function.
    this.rootNode_ = null
    this.dependencyLoader_ = dependencyLoader
  }

ZH.net.PageletProcessor.prototype.setCallback = function(callback) {
  this.callback_ = callback
}

ZH.net.PageletProcessor.prototype.getInstanceFromConstructor = function(nodeConstructor, meta) {
  var instance_ = nodeConstructor.createInstance?nodeConstructor.createInstance(meta):null;

  //this type is Singleton.
  if (!instance_) {
    instance_ = nodeConstructor.getInstance?nodeConstructor.getInstance(meta):null;
  }

  if ( !instance_ && goog.isFunction(nodeConstructor) ) {
    /*jshint newcap:false */
    instance_ = new nodeConstructor(meta)
  }

  return instance_
}

ZH.net.PageletProcessor.prototype.initNodeTree = function(entryId) {
  //TBD: Load CSS file.
  
  var entry = null,
      isRoot = false

  if (!entryId) {
    // Should be root element.
    entryId = this.pagelet_.getInforMap()['ROOT'][0]
    isRoot = true
  }
  entry = this.infoCache_[entryId]

  var element = goog.dom.getElement(entryId)

  if (!element) {
    throw new Error('Can not find element for: ' + entryId + '@' + entry['js'])
  }

  //we got the info for this node.
  var nodeConstructor = this.registry_.getConstructor(entry['js'])
  var instance_
  if (nodeConstructor) {
    instance_ = this.getInstanceFromConstructor(nodeConstructor, entry['meta'])
  }

  if (instance_) {
    instance_.setId(entryId)
    instance_.decorate(element)

    if (isRoot) {
      this.rootNode_ = instance_
    }

    this.processedCount_++
    //check if all node is be processed.
    if (this.processedCount_ >= this.pagelet_.getTotalNodeCount()) {
      // NOTE: Shall we refact this using Observer patten?
      // for this moment, there will be only one event receive, no necessary.
      if (this.callback_) {
        this.callback_(this.rootNode_)
      }
      return
    }

    // Check if has any child node.
    var map = this.pagelet_.getInforMap()
    var subNodesMap = map[entryId]

    if (subNodesMap) {
      var count = subNodesMap.length;
      for (var k = 0;k < count;k++) {
        this.initNodeTree(subNodesMap[k])
      }
    }
  }
}

ZH.net.PageletProcessor.prototype.renderWithDecoration_ = function() {
  var referElement = goog.dom.getElement(this.pagelet_.getReferNode())
  if (!referElement) {
    throw new Error('Can not find refer element.')
  }

  var domElement = goog.dom.htmlToDocumentFragment(ZH.core.uti.trim(this.pagelet_.getHtml()))

  //IMPORTANAT: if this is not a element but documentFragment node.
  //Normally, any extra line break or comments outside 
  //elements html code should be stripped in template.
  if (domElement.nodeType !== 1 && domElement.childNodes) {
        domElement = goog.array.find(domElement.childNodes, function(el){
          //return firt element node.
          return el.nodeType === 1;
      });
  }
  
  if(!domElement || domElement.nodeType !== 1){
      throw new Error('Dom creation fail.');
  }

  var position = this.pagelet_.getRenderPosition()
  if (position === ZH.net.Pagelet.RenderPosition.APPEND){
      goog.dom.appendChild(referElement, domElement);
  } else if (position === ZH.net.Pagelet.RenderPosition.BEFORE){
      goog.dom.insertSiblingBefore(domElement, referElement);
  } else if (position === ZH.net.Pagelet.RenderPosition.AFTER ||
    position === ZH.net.Pagelet.RenderPosition.REPLACE) {
      goog.dom.insertSiblingAfter(domElement, referElement);
  }

  //remove ref node if is replacement.
  if (position === ZH.net.Pagelet.RenderPosition.REPLACE) {
    goog.dom.removeNode(referElement)
  }
}

ZH.net.PageletProcessor.prototype.unRenderOldNode_ = function() {
  var instance_ = this.registry_.getInstanceById(this.pagelet_.getTargetClass(),
    this.pagelet_.getTargetClientId())
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

ZH.net.PageletProcessor.prototype.updateNode_ = function() {
  var instance_ = this.registry_.getInstanceById(this.pagelet_.getTargetClass(),
    this.pagelet_.getTargetClientId())

  if (instance_) {
    instance_.liveUpdate(this.pagelet_.getHtml(), this.pagelet_.getMessage())
  } else {
    throw new Error('Invalid node to update.')
  }
}

ZH.net.PageletProcessor.prototype.process = function() {
  var renderType = this.pagelet_.getRenderType()
  if ( renderType === ZH.net.Pagelet.RenderType.DECORATION ) {
    // IMPORTANT: TODO, manipulate parent node.
    this.renderWithDecoration_()
  } else if ( renderType === ZH.net.Pagelet.RenderType.UPDATING ) {
    this.updateNode_()
  } else if ( renderType === ZH.net.Pagelet.RenderType.UN_RENDER ) {
    this.unRenderOldNode_()
    return
  }

  var deps = []
  goog.array.forEach(this.pagelet_.getDependencyTree(), function(item) {
    deps.push(item['js'])
    this.infoCache_[item['id']] = item
  }, this)

  this.ensureDependencies(deps)
}

ZH.net.PageletProcessor.prototype.getHandler = function(){
    return this.handler || (this.handler = new goog.events.EventHandler(this));
};

ZH.net.PageletProcessor.prototype.ensureDependencies = function(dependency) {
  this.getHandler().listen(this.dependencyLoader_,
    ZH.net.AbstractDependencyLoader.Events.LOAD, function() {
      this.initNodeTree()
    })
  this.dependencyLoader_.load(dependency)
}
