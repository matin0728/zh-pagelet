goog.provide('ZH.net.Pagelet')

// Pagelet wrapper class.
// A pagelet represent a single tree node.
ZH.net.Pagelet = function(opt_pageletObject) {
  this.html = opt_pageletObject['html']
  
  //{'id' : xxx, js:xxx, css: xx}
  this.rootNode = opt_pageletObject['root_nodes']

  // Keep parents/child mapping.
  this.inforMap = opt_pageletObject['infor_map']

  this.referNode = opt_pageletObject['refer_node']
  this.renderType = opt_pageletObject['render_type']
  this.renderPosition = opt_pageletObject['render_position']

  this.message = opt_pageletObject['message']
  // Optional, this is just for update single node.
  // [ [name, args], [name, args] ]
  
}

ZH.net.Pagelet.prototype.rootNodeList = null

ZH.net.Pagelet.prototype.inforMap = null

ZH.net.Pagelet.prototype.html = ''

ZH.net.Pagelet.prototype.message = {}



ZH.net.Pagelet.RenderPosition = {
  REPLACE: 'replace', // target dom node will be replaced. 
  APPEND: 'append', //will crate a new element add append to it.
  BEFORE: 'before',
  AFTER: 'after'
};

ZH.net.Pagelet.RenderType = {
  RENDER: 'render',
  DECORATION: 'decoration',
  NONE: 'none',// used for existing component.
  UPDATING: 'updating', //used for live node update.
  UN_RENDER: 'un_render' //remove component.
};