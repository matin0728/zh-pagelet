goog.provide('ZH.core.uti');

// goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.string');
goog.require('goog.array');
goog.require('goog.json');

ZH.core.uti.trim = function(str) {
  //force convert to string.
  str = str + ''
  if (!str) {
    return '';
  }
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
};