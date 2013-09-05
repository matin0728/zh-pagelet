goog.provide('ZH.net.XhrRequestSendProvider');

goog.require('ZH.net.AbstractRequestSenderProvider');

ZH.net.XhrRequestSendProvider = function() {

};

goog.inherits(ZH.net.XhrRequestSendProvider, ZH.net.AbstractRequestSenderProvider)

ZH.net.XhrRequestSendProvider.prototype.send = function(request){
    var xhr = new ZH.net.XhrIo();
    this.getHandler().listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
        var ret = e.target.getResponseJson();
        var result = new ZH.net.RequestResult(ret);
        this.handlerResult(result)      
    });
    xhr.ajax(request);
};