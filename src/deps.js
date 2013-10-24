// This file was autogenerated by vendor/closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../../src/core_registry.js', ['ZH.core.Registry'], ['goog.array', 'goog.array.ArrayLike', 'goog.debug.Logger', 'goog.debug.TextFormatter', 'goog.dom', 'goog.structs.Map']);
goog.addDependency('../../../../src/core_uti.js', ['ZH.core.uti'], ['goog.array', 'goog.json', 'goog.string', 'goog.style']);
goog.addDependency('../../../../src/demo.js', ['ZH.demo'], ['goog.ui.Component']);
goog.addDependency('../../../../src/live_query.js', ['ZH.core.LiveQuery'], []);
goog.addDependency('../../../../src/main.js', ['ZH.main'], ['ZH.core.LiveQuery', 'ZH.core.Registry', 'ZH.core.uti', 'ZH.net.AbstractRequestSenderProvider', 'ZH.net.Pagelet', 'ZH.net.PageletProcessor', 'ZH.net.Request', 'ZH.net.RequestManager', 'ZH.net.RequestResult', 'ZH.net.XhrRequestSendProvider', 'ZH.ui.LiveComponent', 'ZH.ui.LiveComponentPlugin']);
goog.addDependency('../../../../src/net_pagelet.js', ['ZH.net.Pagelet'], []);
goog.addDependency('../../../../src/net_pagelet_processor.js', ['ZH.net.PageletProcessor'], ['ZH.core.Registry', 'ZH.core.uti', 'ZH.net.Pagelet', 'goog.array', 'goog.dom']);
goog.addDependency('../../../../src/net_request.js', ['ZH.net.Request'], ['ZH.core.Registry', 'goog.Uri', 'goog.array', 'goog.async.Deferred', 'goog.json', 'goog.structs.Map']);
goog.addDependency('../../../../src/net_request_abstract_provider.js', ['ZH.net.AbstractRequestSenderProvider'], ['goog.array', 'goog.log']);
goog.addDependency('../../../../src/net_request_manager.js', ['ZH.net.RequestManager'], ['ZH.net.PageletProcessor', 'ZH.net.RequestResult', 'goog.array', 'goog.debug.Logger', 'goog.debug.TextFormatter', 'goog.dom', 'goog.pubsub.PubSub', 'goog.structs.Map', 'goog.style']);
goog.addDependency('../../../../src/net_request_provider_xhr.js', ['ZH.net.XhrRequestSendProvider'], ['ZH.net.AbstractRequestSenderProvider']);
goog.addDependency('../../../../src/net_request_result.js', ['ZH.net.RequestResult'], ['ZH.net.Pagelet', 'goog.array']);
goog.addDependency('../../../../src/ui_live_component.js', ['ZH.ui.LiveComponent', 'ZH.ui.LiveComponent.Error', 'ZH.ui.LiveComponent.EventType', 'ZH.ui.LiveComponent.State'], ['ZH.core.LiveQuery', 'ZH.core.Registry', 'ZH.core.uti', 'ZH.ui.LiveComponentPlugin', 'goog.array', 'goog.asserts', 'goog.dom', 'goog.dom.NodeType', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.log', 'goog.object', 'goog.structs.Map', 'goog.style', 'goog.ui.IdGenerator']);
goog.addDependency('../../../../src/ui_plugin.js', ['ZH.ui.LiveComponentPlugin'], ['goog.events.EventTarget', 'goog.functions', 'goog.log', 'goog.object', 'goog.reflect']);
