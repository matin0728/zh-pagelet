goog.provide('ZH.net.AbstractRequestSenderProvider');

goog.require('goog.array')
goog.require('goog.log');

ZH.net.AbstractRequestSenderProvider = function() {

};

// We don't need a request filter at this moment.
//ZH.net.AbstractRequestSenderProvider.prototype.addRequestFilter = function() {}
//ZH.net.AbstractRequestSenderProvider.prototype.requestFilters_ = []

ZH.net.AbstractRequestSenderProvider.prototype.send = function(request) {
  //Should override by child class
  this.dispathEvent(ZH.net.AbstractRequestSenderProvider.EventType.ON_SEND)
};

ZH.net.AbstractRequestSenderProvider.prototype.logger =
    goog.log.getLogger('ZH.net.AbstractRequestSenderProvider');

ZH.net.AbstractRequestSenderProvider.prototype.handleEvent = function(e){
  //TODO:
  //on_send, on_error, on_timeout, on_complete.
};

ZH.net.AbstractRequestSenderProvider.prototype.handleResult = function(result, request){
  this.dispathEvent(ZH.net.AbstractRequestSenderProvider.EventType.ON_COMPLETE)

  if(result.isError) {
    request.getDeferred().errback(result);
  }

  if(result.redirectUrl){
      //delay execution.
      if(result.message){
          var url_ = result.redirectUrl;
          setTimeout(function(){
              window.top.location.href = url_;
          }, 3000);
      }else{
         window.top.location.href = result.redirectUrl;
      }
  }

  if(result.refreshFlag){
      if(result.message){
          //delay execution.
          setTimeout(function(){
              window.location.reload();
          }, 3000);
      }else{
          window.location.reload();
      }
      
  }

  if(request.isAutoHandleResult()){
    this.autoHandleResult(result, request);
  } else {
    request.getDeferred().callback(result);
  }
};

ZH.net.AbstractRequestSenderProvider.prototype.autoHandleResult = function(result, request){

  // var modules = []
  // goog.array.forEach(result.pagelets, function(p, index) {
  //   modules.push(p.module)
  // })


  // //create closure.
  // var req = request, ret = result
  // //although we ca get module exports on this callback,
  // // but module will regist it self on registry, so we needn't it from
  // // this way.
  // var cb = function() {
  //   var processor = ZH.core.PageletProcessor.getInstance();
  //   var instances = processor.processPagelet(ret.pagelets)
  //   req.getDeferred().callback(req, ret, instances);
  // }

  // var require = window['require']
  // if (typeof require === 'function') {
  //   require.async(modules, cb)
  // } else {
  //   this.logger.severe('Module loader is not ready, can not process pagelet.')
  // }
};



ZH.net.AbstractRequestSenderProvider.EventType = {
  ON_SEND: 'on_send',
  ON_ERROR: 'on_error',
  ON_TIMEOUT: 'on_timeout',
  ON_SUCCESS: 'on_success',
  ON_COMPLETE: 'on_complete'
};



