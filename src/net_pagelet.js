goog.require('goog.object')
goog.require('goog.array')
goog.provide('ZH.net.Pagelet')

// Pagelet wrapper class.
// A pagelet represent a single tree node.
ZH.net.Pagelet = function(opt_pageletObject) {
  this.html_ = opt_pageletObject['html'] || ''

  // This used only for updating existing node.
  this.targetClientId_ = opt_pageletObject['target_client_id']
  // This used only for updating or un_rendering.
  this.targetClass_ = opt_pageletObject['target_class']
  
  //[{'id' : xxx, js:xxx, css: xx}, ...]
  this.dependencyTree_ = opt_pageletObject['dependency_tree']

  // Keep parents/child mapping.
  //{'ROOT': [root_node_id], '[parent_node_id]': [child_node_ids......]}
  this.inforMap_ = opt_pageletObject['infor_map'] || {}

  this.referNode_ = opt_pageletObject['refer_node']

  this.renderType_ = opt_pageletObject['render_type']

  this.renderPosition_ = opt_pageletObject['render_position']

  this.message_ = opt_pageletObject['message']
  // Optional, this is just for update single node.
  // [ [name, args], [name, args] ]

  this.totalNodeCount_ = 0

  this.caculateNodeCount_()
  
}

ZH.net.Pagelet.prototype.totalNodeCount_ = 0

ZH.net.Pagelet.prototype.getTotalNodeCount = function() {
  return this.totalNodeCount_
}

ZH.net.Pagelet.prototype.caculateNodeCount_ = function() {
  var cache = {}
  var record = function(item) {
    cache[item] = 1
  }
  for (var k in this.inforMap_) {
    if (this.inforMap_.hasOwnProperty(k)) {
      goog.array.forEach(this.inforMap_[k], record)
    }
  }

  this.totalNodeCount_ = goog.object.getKeys(cache).length

}

ZH.net.Pagelet.prototype.html_ = ''
ZH.net.Pagelet.prototype.getHtml = function() {
  return this.html_
}

ZH.net.Pagelet.prototype.targetClientId_ = ''
ZH.net.Pagelet.prototype.getTargetClientId = function() {
  return this.targetClientId_
}

ZH.net.Pagelet.prototype.targetClass_ = ''
ZH.net.Pagelet.prototype.getTargetClass = function() {
  return this.targetClass_
}


ZH.net.Pagelet.prototype.dependencyTree_ = null
ZH.net.Pagelet.prototype.getDependencyTree = function() {
  return this.dependencyTree_
}

ZH.net.Pagelet.prototype.inforMap_ = null
ZH.net.Pagelet.prototype.getInforMap = function() {
  return this.inforMap_
}

ZH.net.Pagelet.prototype.referNode_ = null
ZH.net.Pagelet.prototype.getReferNode = function() {
  return this.referNode_
}

ZH.net.Pagelet.prototype.renderType_ = null
ZH.net.Pagelet.prototype.getRenderType = function() {
  return this.renderType_
}

ZH.net.Pagelet.prototype.renderPosition_ = null
ZH.net.Pagelet.prototype.getRenderPosition = function() {
  return this.renderPosition_
}

ZH.net.Pagelet.prototype.message_ = {}
ZH.net.Pagelet.prototype.getMessage = function() {
  return this.message_
}





ZH.net.Pagelet.RenderPosition = {
  REPLACE: 'replace', // target dom node will be replaced. 
  APPEND: 'append', //will crate a new element append to it.
  BEFORE: 'before',
  AFTER: 'after'
};

ZH.net.Pagelet.RenderType = {
  RENDER: 'render', // IMPORTANT: not support at this moment, all rendering is based on decoration.
  DECORATION: 'decoration',
  UPDATING: 'updating', //used for live node update.
  UN_RENDER: 'un_render' //remove component.
};