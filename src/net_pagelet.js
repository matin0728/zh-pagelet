goog.provide('ZH.net.Pagelet')

ZH.net.Pagelet = function(opt_pageletObject) {
  //TODO: Do we need a constructor?
}

ZH.net.Pagelet.prototype.typeString = null

ZH.net.Pagelet.prototype.id = null

ZH.net.Pagelet.prototype.markup = null

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