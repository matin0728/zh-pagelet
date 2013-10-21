goog.provide('ZH.net.RequestManager');

goog.require('ZH.net.RequestResult');
goog.require('ZH.core.PageletProcessor');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.structs.Map');
goog.require('goog.pubsub.PubSub');

goog.require('goog.debug.Logger');
goog.require('goog.debug.TextFormatter');


/**
 * @constructor
 */
ZH.net.RequestManager = function(){
  
};

ZH.net.RequestManager.providers_ = {};

ZH.net.RequestManager.instance_ = null;

ZH.net.RequestManager.getProvider = function(opt_porviderName){
  var instance = ZH.net.RequestManager.instance_
  if (!instance) {
    instance = new ZH.net.RequestManager()
    ZH.net.RequestManager.instance_ = instance
  }

  var providerName = opt_porviderName || instance.defaultProviderName_
  var provider = goog.object.get(instance.providers_, providerName)

  if (!provider) {
    provider = instance.allProviders_[providerName].getInstance()
    // instance.getHandler.call(instance).listen(provider, 
    //   goog.object.keys(ZH.net.AbstractRequestSenderProvider.EventType), instance)
    instance.providers_[providerName] = provider
  }
  return provider
};

ZH.net.RequestManager.prototype.setDefaultProvider = function(providerName) {
  this.defaultProviderName_ = providerName;
};

ZH.net.RequestManager.prototype.allProviders_ = {
  'xhr': ZH.net.XhrRequestSenderProvider,
  'channel': ZH.net.ChannelRequestSerderProvider
};

ZH.net.RequestManager.prototype.providers_ = {};

ZH.net.RequestManager.prototype.addProvider = function(providerName, provider) {
  this.providers_[providerName] = provider
}

ZH.net.RequestManager.prototype.defaultProvider_ = ZH.net.XhrRequestSenderProvider;

ZH.net.RequestManager.prototype.defaultProviderName_ = 'xhr';

ZH.net.RequestManager.prototype.logger = goog.debug.Logger.getLogger('ZH.net.RequestManager');

// ZH.net.RequestManager.prototype.getHandler = function(){
//     return this.handler || (this.handler = new goog.events.EventHandler(this));
// };



// ZH.net.RequestManager.prototype.onXhrComplete_ = function(e){
//     //this.logger.log("onXhrComplete_");
//     
// 
// };

ZH.net.RequestManager.prototype.handleResultByDefault = function(result){
    this.showGlobalLoading(false);
    return this.autoHandleResult(result);
    // if(result.autoHandleSuccess && !result.isError || result.autoHandleError && result.isError){
    //     
    // }
};











