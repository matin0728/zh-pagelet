goog.provide('ZH.net.AbstractRequestSenderProvider');

ZH.net.AbstractRequestSenderProvider = function() {

};

// We don't need a request filter at this moment.
//ZH.net.AbstractRequestSenderProvider.prototype.addRequestFilter = function() {}
//ZH.net.AbstractRequestSenderProvider.prototype.requestFilters_ = []

ZH.net.AbstractRequestSenderProvider.prototype.send = function(request) {
  //Should override by child class
  this.dispathEvent(ZH.net.AbstractRequestSenderProvider.EventType.ON_SEND)
};

ZH.net.AbstractRequestSenderProvider.prototype.handleEvent = function(e){
  //TODO: 
  //on_send, on_error, on_timeout
};

ZH.net.AbstractRequestSenderProvider.prototype.handleResult = function(result){
  var instances = [];
  if(request.isAutoHandleResult()){
      instances = this.autoHandleResult(result);
  }

  if(result.isError){
      request.getDeferred().errback(result);
  }else{
      result.setInstances(instances);
      request.getDeferred().callback(result);
  }
};

ZH.net.RequestManager.prototype.autoHandleResult = function(result){

  this.dispathEvent(ZH.net.AbstractRequestSenderProvider.EventType.ON_COMPLETE)
  
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

  var processor = ZH.core.PageletProcessor.getInstance();
  processor.setParentsMap(result.parentsMap, result.pagelets);
  
  var instances = []
  goog.array.forEach(result.pagelets, function(p){
      var instance = ZH.core.PageletProcessor.getInstance().processPagelet(p);
      //if this is a delete pagelet, no instance will be created.
      if(instance){
          instances.push(instance);
          var childs = result.parentsMap[instance.getIdentity()];
          if(childs && childs.length){
              var len = childs.length;
              for(var i=0;i<len;i++){
                  processor.initComponent(childs[i], instance);
              }
          }
      }

  }, this);
  
  return instances;
};



ZH.net.AbstractRequestSenderProvider.EventType = {
  ON_SEND: 'on_send',
  ON_ERROR: 'on_error',
  ON_TIMEOUT: 'on_timeout',
  ON_SUCCESS: 'on_success',
  ON_COMPLETE: 'on_complete'
}



/