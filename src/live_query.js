goog.provide('ZH.core.LiveQuery')


ZH.core.LiveQuery = function(typeString, id, meta) {
  this.typeString = null
  this.id = null
  //meta is a map object.
  this.meta
};

ZH.core.LiveQuery.prototype.getJSON = function() {
  //return a pure object for seialize.
  return {
    'type': this.typeString,
    'id': this.id,
    'meta': this.meta.toObject()
  }
};