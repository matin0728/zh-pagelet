// This is the compile target file for link all src file together.

goog.provide('ZH.main');

goog.require('ZH.core.Registry');
goog.require('ZH.core.uti');
goog.require('ZH.core.LiveQuery');
goog.require('ZH.net.Pagelet');
goog.require('ZH.net.PageletProcessor');
goog.require('ZH.net.Request');
goog.require('ZH.net.AbstractRequestSenderProvider');
goog.require('ZH.net.RequestManager');
goog.require('ZH.net.XhrRequestSendProvider');
goog.require('ZH.net.RequestResult');
goog.require('ZH.ui.LiveComponent');
goog.require('ZH.ui.LiveComponentPlugin');

ZH.main = function(rootNodesMap, parentChildMap) {
  if (window.console) {
    window.console.log('App start');
  }
};