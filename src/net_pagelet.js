goog.provide('ZH.net.Pagelet')

// Pagelet wrapper class.
// A pagelet represent a single tree node.
ZH.net.Pagelet = function(opt_pageletObject) {
  this.html = opt_pageletObject['html']
  
  //{'id' : xxx, js:xxx, css: xx}
  this.rootNode = opt_pageletObject['root_node']

  // Keep parents/child mapping.
  this.inforMap = opt_pageletObject['infor_map']

  this.referElement = opt_pageletObject['message']['reffer_node'],
  this.renderType = opt_pageletObject['message']['render_type'],
  this.renderPosition = opt_pageletObject['message']['render_position'],

  // Optional, this is just for update single node.
  if (opt_pageletObject['message']) {
    this.message = {
      eventName : opt_pageletObject['message']['event_name'],
      eventArgs : opt_pageletObject['message']['event_args']
    }  
  }
  
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