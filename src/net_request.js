goog.provide("ZH.net.Request");

goog.require('ZH.core.Registry');

goog.require('goog.async.Deferred');
goog.require('goog.structs.Map');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.json');


//Ajax request wrapper class.

/**
 * @constructor
 */
ZH.net.Request = function(requestUri, opt_postData){
  this.requestUri = (goog.isString(requestUri)?new goog.Uri(requestUri) : requestUri);
  
  //TODO: Check post data type, could be Object? or force to use goog.structs.Map.
  var map;
  if (goog.isObject(opt_postData) {
    map = new new goog.structs.Map(opt_postData)
  } else {
    map = new goog.structs.Map()
  }

  this.postData = map
  this.showLoading = true
  this.requestMethod = 'POST'
  this.liveQueries_ = []
  this.deferred_ = null
  this.isAutoHandleResult_ = true;
};

ZH.net.Request.prototype.getDeferred = function(){
    var d = this.deferred_;
    if(!d){
        d = new goog.async.Deferred();
        this.deferred_ = d;
    }
    return d;
};

ZH.net.Request.prototype.preventAutoHandleResult = function(){
  this.isAutoHandleResult_ = false;
};

ZH.net.Request.prototype.isAutoHandleResult = function(){
  return this.isAutoHandleResult_
};

ZH.net.Request.prototype.addQuery = function(query){
  this.liveQueries_.push(query);
};

ZH.net.Request.prototype.clearQuery = function(){
  this.liveQueries_ = [];
};

ZH.net.Request.prototype.getQueries = function(){
  return this.liveQueries_
};

ZH.net.Request.prototype.filterQuery = function(func, opt_context){
  this.liveQueries_ = goog.array.filter(this.liveQueries_, func, opt_context);
};

ZH.net.Request.prototype.removeQueryByType = function(typeString){
  this.liveQueries_ = goog.array.filter(this.liveQueries_, function(query){
    return query.typeString !== ZH.core.Registry.getInstance().shortName(typeString)
  }, this);
};

ZH.net.Request.prototype.isShowGlobalLoading = function(){
    return this.showLoading
};

ZH.net.Request.prototype.setGlobalLoadingEnabled = function(isEnable){
    this.showLoading = isEnable
};

ZH.net.Request.prototype.setMethod = function(requestMethod){
    this.requestMethod = (requestMethod === 'GET' ? 'GET' : 'POST');
};

ZH.net.Request.prototype.getRequestPath = function(){
    return this.requestUri.toString();
};

ZH.net.Request.prototype.setRequesitUri = function(uri){
    this.requestUri = uri;
};

ZH.net.Request.prototype.getRequesitUri = function(){
    return this.requestUri;
};

ZH.net.Request.prototype.setUrlParam = function(k, v){
    return this.requestUri.setParameterValue(k, v);
};

ZH.net.Request.prototype.setPostParam = function(k, v){
    return this.postData.set(k, v);
};

ZH.net.Request.prototype.getPostData = function(){
    var keys = this.postData.getKeys();
    var data_ = [],
        map_ = this.postData;
    goog.array.forEach(keys, function(k){
        data_.push(k + "="+encodeURIComponent(map_.get(k)));
    }, this);
    
    var liveQueryParams = [];
    goog.array.forEach(this.liveQueries_, function(query){
        liveQueryParams.push(query.getJSON());
    }, this);

    data_.push('live_components=' + encodeURIComponent(goog.json.serialize(liveQueryParams)));
    
    return data_.join("&");
};






