goog.provide('ZH.net.Pagelet')

ZH.net.Pagelet = function(opt_pageletObject) {
  // Module identity? for seaJS to require.
  this.module = opt_pageletObject['module']
  // Client id.
  this.id = opt_pageletObject['id']
  this.html = opt_pageletObject['html']
  // Keep parents/child mapping.
  this.map = opt_pageletObject['map']
  this.referElement = opt_pageletObject['reffer_node']
  this.renderType = opt_pageletObject['render_type']
  this.renderPosition = opt_pageletObject['render_position']
  this.eventCategory = opt_pageletObject['event_category']
  this.eventArgs = opt_pageletObject['event_args']
}

// ZH.net.Pagelet.prototype.typeString = null
ZH.net.Pagelet.prototype.module = null

ZH.net.Pagelet.prototype.id = null

ZH.net.Pagelet.prototype.html = null

ZH.net.Pagelet.prototype.referElement = null

ZH.net.Pagelet.prototype.renderType = null

ZH.net.Pagelet.prototype.renderPosition = null

ZH.net.Pagelet.prototype.eventType = null

ZH.net.Pagelet.prototype.eventArgs = null



ZH.net.Pagelet.RenderPosition = {
  REPLACE: 'replace', // target dom node will be replaced. 
  APPEND: 'append', //will crate a new element add append to it.
  BEFORE: 'before',
  AFTER: 'after'
};

ZH.net.Pagelet.RenderType = {
  RENDER: 'render',
  DECORATION: 'decoration',
  NONE: 'none',// used for none UI component.
  UPDATING: 'updating', //used for live node update.
  UN_RENDER: 'un_render' //remove component.
};