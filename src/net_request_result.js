goog.provide("ZH.net.RequestResult");

goog.require('ZH.net.Pagelet');
goog.require('goog.array');
/**
 * @constructor
 */
ZH.net.RequestResult = function(result){
  this.rawResult_ = result
  this.error_ = (result['r'] === 1)
  this.message_ = result['msg']
  this.redirectUrl_ = result['ru'] || result['redirect']
  this.refreshFlag_ = result['rf'] || result['refresh']
  //this extra data is NOT encouraged to use.
  this.extraData_ = result['d'] || result['data']
  // this.rootNodes = (result['rn'] || []);
  // this.parentsMap = result['mp'] || {};
  this.pagelets_ = []
  this.createdInstances_ = null
  var pagelets = result['p'] || result['pagelets']
  if(pagelets && pagelets.length){
    goog.array.forEach(pagelets, function(p){
      this.pagelets_.push(new ZH.net.Pagelet(p))
    }, this);
  }
};

ZH.net.RequestResult.prototype.getRawResult = function() {
  return this.rawResult_
};

ZH.net.RequestResult.prototype.isError = function() {
  return this.error_
};

ZH.net.RequestResult.prototype.getMessage = function() {
  return this.message_
};

ZH.net.RequestResult.prototype.getRedirectUrl = function() {
  return this.redirectUrl_
};

ZH.net.RequestResult.prototype.isRefresh = function() {
  return this.refreshFlag_
};

ZH.net.RequestResult.prototype.getExtraData = function() {
  return this.extraData_
};

ZH.net.RequestResult.prototype.getPagelets = function() {
  return this.pagelets_
};

ZH.net.RequestResult.prototype.getInstanceByType = function(typeString){
  return goog.array.find(this.getNewInstances(), function(instance){
    return instance.getTypeString() === typeString;
  });
};

ZH.net.RequestResult.prototype.getNewInstances = function(){
  return this.createdInstances_;
};

//add newly created instances.
ZH.net.RequestResult.prototype.setInstances = function(instances){
  this.createdInstances_ = instances;
};

 
 