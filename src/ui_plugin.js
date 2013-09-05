/**
 * @fileoverview Abstract API for LiveComponent plugins.
 *
 */

goog.provide('ZH.ui.LiveComponentPlugin');

goog.require('goog.events.EventTarget');
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.reflect');



/**
 * Abstract API for trogedit plugins.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ZH.ui.LiveComponentPlugin = function(opt_options) {
  goog.events.EventTarget.call(this);

  /**
   * Whether this plugin is enabled for the registered component object.
   * @type {boolean}
   * @private
   */
  this.enabled_ = true;

  var options = goog.object.clone(this.defaults_)
  goog.object.extend(options, opt_options || {})

  this.options = options
};
goog.inherits(ZH.ui.LiveComponentPlugin, goog.events.EventTarget);

ZH.ui.LiveComponentPlugin.prototype.defaults_ = {}

/**
 * The component object this plugin is attached to.
 * @type {ZH.core.LiveComponent}
 * @protected
 */
ZH.ui.LiveComponentPlugin.prototype.component_ = null;


/**
 * @return {goog.dom.DomHelper?} The dom helper object associated with the
 *     currently active component.
 */
ZH.ui.LiveComponentPlugin.prototype.getComponentHelper = function() {
  return this.getComponent() && this.getComponent().getDomHelper();
};


/**
 * Indicates if this plugin should be automatically disposed when the
 * registered component is disposed. This should be changed to false for
 * plugins used as multi-component plugins.
 * @type {boolean}
 * @private
 */
ZH.ui.LiveComponentPlugin.prototype.autoDispose_ = true;


/**
 * The logger for this plugin.
 * @type {goog.log.Logger}
 * @protected
 */
ZH.ui.LiveComponentPlugin.prototype.logger =
    goog.log.getLogger('ZH.ui.LiveComponentPlugin');


/**
 * Sets the component object for use with this plugin.
 * @return {ZH.core.LiveComponent} The editable component object.
 * @protected
 * @suppress {deprecated} Until componentObject can be made private.
 */
ZH.ui.LiveComponentPlugin.prototype.getComponent = function() {
  return this.component_;
};


/**
 * Sets the component object for use with this plugin.
 * @param {ZH.core.LiveComponent} componentObject The editable component object.
 * @protected
 * @suppress {deprecated} Until componentObject can be made private.
 */
ZH.ui.LiveComponentPlugin.prototype.setComponent = function(componentObject) {
  this.component_ = componentObject;
};


/**
 * Registers the component object for use with this plugin.
 * @param {ZH.core.LiveComponent} componentObject The editable component object.
 */
ZH.ui.LiveComponentPlugin.prototype.registerComponentObject = function(componentObject) {
  this.setComponent(componentObject);
};


/**
 * Unregisters and disables this plugin for the current component object.
 * @param {ZH.core.LiveComponent} componentObj The component object. For single-component
 *     plugins, this parameter is ignored.
 */
ZH.ui.LiveComponentPlugin.prototype.unregisterComponentObject = function(componentObj) {
  if (this.getComponent()) {
    this.disable(this.getComponent());
    this.setComponent(null);
  }
};


/**
 * Enables this plugin for the specified, registered component object. A component
 * object should only be enabled when it is loaded.
 * @param {ZH.core.LiveComponent} componentObject The component object.
 */
ZH.ui.LiveComponentPlugin.prototype.enable = function(componentObject) {
  if (this.getComponent() === componentObject) {
    this.enabled_ = true;
  } else {
    goog.log.error(this.logger, 'Trying to enable an unregistered component with ' +
        'this plugin.');
  }
};


/**
 * Disables this plugin for the specified, registered component object.
 * @param {ZH.core.LiveComponent} componentObject The component object.
 */
ZH.ui.LiveComponentPlugin.prototype.disable = function(componentObject) {
  if (this.getComponent() === componentObject) {
    this.enabled_ = false;
  } else {
    goog.log.error(this.logger, 'Trying to disable an unregistered component ' +
        'with this plugin.');
  }
};


/**
 * Returns whether this plugin is enabled for the component object.
 *
 * @param {ZH.core.LiveComponent} componentObject The component object.
 * @return {boolean} Whether this plugin is enabled for the component object.
 */
ZH.ui.LiveComponentPlugin.prototype.isEnabled = function(componentObject) {
  return this.getComponent() === componentObject ? this.enabled_ : false;
};


/**
 * Set if this plugin should automatically be disposed when the registered
 * component is disposed.
 * @param {boolean} autoDispose Whether to autoDispose.
 */
ZH.ui.LiveComponentPlugin.prototype.setAutoDispose = function(autoDispose) {
  this.autoDispose_ = autoDispose;
};


/**
 * @return {boolean} Whether or not this plugin should automatically be disposed
 *     when it's registered component is disposed.
 */
ZH.ui.LiveComponentPlugin.prototype.isAutoDispose = function() {
  return this.autoDispose_;
};

/**
 * @param {string} command The command to check.
 * @return {boolean} If true, component will not dispatch change events
 *     for commands of this type. This is useful for "seamless" plugins like
 *     dialogs and lorem ipsum.
 */
ZH.ui.LiveComponentPlugin.prototype.isSilentCommand = goog.functions.FALSE;


/** @override */
ZH.ui.LiveComponentPlugin.prototype.disposeInternal = function() {
  if (this.getComponent()) {
    this.unregisterComponentObject(this.getComponent());
  }

  ZH.ui.LiveComponentPlugin.superClass_.disposeInternal.call(this);
};


/**
 * @return {string} The ID unique to this plugin class. Note that different
 *     instances off the plugin share the same classId.
 */
ZH.ui.LiveComponentPlugin.prototype.getTrogClassId = goog.functions.NULL;


/**
 * An enum of operations that plugins may support.
 * @enum {number}
 */
ZH.ui.LiveComponentPlugin.Op = {
  KEYDOWN: 1,
  KEYPRESS: 2,
  KEYUP: 3,
  SELECTION: 4,
  SHORTCUT: 5,
  EXEC_COMMAND: 6,
  QUERY_COMMAND: 7,
  PREPARE_CONTENTS_HTML: 8,
  CLEAN_CONTENTS_HTML: 10,
  CLEAN_CONTENTS_DOM: 11
};


/**
 * A map from plugin operations to the names of the methods that
 * invoke those operations.
 */
ZH.ui.LiveComponentPlugin.OPCODE = goog.object.transpose(
    goog.reflect.object(ZH.ui.LiveComponentPlugin, {
      handleKeyDown: ZH.ui.LiveComponentPlugin.Op.KEYDOWN,
      handleKeyPress: ZH.ui.LiveComponentPlugin.Op.KEYPRESS,
      handleKeyUp: ZH.ui.LiveComponentPlugin.Op.KEYUP,
      handleSelectionChange: ZH.ui.LiveComponentPlugin.Op.SELECTION,
      handleKeyboardShortcut: ZH.ui.LiveComponentPlugin.Op.SHORTCUT,
      execCommand: ZH.ui.LiveComponentPlugin.Op.EXEC_COMMAND,
      queryCommandValue: ZH.ui.LiveComponentPlugin.Op.QUERY_COMMAND,
      prepareContentsHtml: ZH.ui.LiveComponentPlugin.Op.PREPARE_CONTENTS_HTML,
      cleanContentsHtml: ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_HTML,
      cleanContentsDom: ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_DOM
    }));


/**
 * A set of op codes that run even on disabled plugins.
 */
ZH.ui.LiveComponentPlugin.IRREPRESSIBLE_OPS = goog.object.createSet(
    ZH.ui.LiveComponentPlugin.Op.PREPARE_CONTENTS_HTML,
    ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_HTML,
    ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_DOM);


/**
 * Handles keydown. It is run before handleKeyboardShortcut and if it returns
 * true handleKeyboardShortcut will not be called.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @return {boolean} Whether the event was handled and thus should *not* be
 *     propagated to other plugins or handleKeyboardShortcut.
 */
ZH.ui.LiveComponentPlugin.prototype.handleKeyDown = null;


/**
 * Handles keypress. It is run before handleKeyboardShortcut and if it returns
 * true handleKeyboardShortcut will not be called.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @return {boolean} Whether the event was handled and thus should *not* be
 *     propagated to other plugins or handleKeyboardShortcut.
 */
ZH.ui.LiveComponentPlugin.prototype.handleKeyPress = null;


/**
 * Handles keyup.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @return {boolean} Whether the event was handled and thus should *not* be
 *     propagated to other plugins.
 */
ZH.ui.LiveComponentPlugin.prototype.handleKeyUp = null;


/**
 * Handles selection change.
 * @param {!goog.events.BrowserEvent=} opt_e The browser event.
 * @param {!Node=} opt_target The node the selection changed to.
 * @return {boolean} Whether the event was handled and thus should *not* be
 *     propagated to other plugins.
 */
ZH.ui.LiveComponentPlugin.prototype.handleSelectionChange = null;


/**
 * Handles keyboard shortcuts.  Preferred to using handleKey* as it will use
 * the proper event based on browser and will be more performant. If
 * handleKeyPress/handleKeyDown returns true, this will not be called. If the
 * plugin handles the shortcut, it is responsible for dispatching appropriate
 * events (change, selection change at the time of this comment). If the plugin
 * calls execCommand on the editable component, then execCommand already takes care
 * of dispatching events.
 * NOTE: For performance reasons this is only called when any key is pressed
 * in conjunction with ctrl/meta keys OR when a small subset of keys (defined
 * in ZH.core.LiveComponent.POTENTIAL_SHORTCUT_KEYCODES_) are pressed without
 * ctrl/meta keys. We specifically don't invoke it when altKey is pressed since
 * alt key is used in many i8n UIs to enter certain characters.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @param {string} key The key pressed.
 * @param {boolean} isModifierPressed Whether the ctrl/meta key was pressed or
 *     not.
 * @return {boolean} Whether the event was handled and thus should *not* be
 *     propagated to other plugins. We also call preventDefault on the event if
 *     the return value is true.
 */
ZH.ui.LiveComponentPlugin.prototype.handleKeyboardShortcut = null;


/**
 * Handles execCommand. This default implementation handles dispatching
 * BEFORECHANGE, CHANGE, and SELECTIONCHANGE events, and calls
 * execCommandInternal to perform the actual command. Plugins that want to
 * do their own event dispatching should override execCommand, otherwise
 * it is preferred to only override execCommandInternal.
 *
 * This version of execCommand will only work for single component plugins.
 * Multi-component plugins must override execCommand.
 *
 * @param {string} command The command to execute.
 * @param {...*} var_args Any additional parameters needed to
 *     execute the command.
 * @return {*} The result of the execCommand, if any.
 */
ZH.ui.LiveComponentPlugin.prototype.execCommand = function(command, var_args) {
  // TODO(user): Replace all uses of isSilentCommand with plugins that just
  // override this base execCommand method.
  var silent = this.isSilentCommand(command);
  if (!silent) {
    this.getComponent().dispatchBeforeChange();
  }

  var result
  try {
    result = this.execCommandInternal.apply(this, arguments);
  } finally {
    // If the above execCommandInternal call throws an exception, we still need
    // to turn change events back on (see http://b/issue?id=1471355).
    // NOTE: If if you add to or change the methods called in this finally
    // block, please add them as expected calls to the unit test function
    // testExecCommandException().
    if (!silent) {
      // dispatchChange includes a call to startChangeEvents, which unwinds the
      // call to stopChangeEvents made before the try block.
      this.getComponent().dispatchChange();
      // this.getComponent().dispatchSelectionChangeEvent();
    }
  }

  return result;
};


/**
 * Handles execCommand. This default implementation does nothing, and is
 * called by execCommand, which handles event dispatching. This method should
 * be overriden by plugins that don't need to do their own event dispatching.
 * If custom event dispatching is needed, execCommand shoul be overriden
 * instead.
 *
 * @param {string} command The command to execute.
 * @param {...*} var_args Any additional parameters needed to
 *     execute the command.
 * @return {*} The result of the execCommand, if any.
 * @protected
 */
ZH.ui.LiveComponentPlugin.prototype.execCommandInternal = null;

ZH.ui.LiveComponentPlugin.prototype.handleClick = null;


/**
 * Whether the string corresponds to a command this plugin handles.
 * @param {string} command Command string to check.
 * @return {boolean} Whether the plugin handles this type of command.
 */
ZH.ui.LiveComponentPlugin.prototype.isSupportedCommand = function(command) {
  return false;
};

/**
 * An enum of operations that plugins may support.
 * @enum {number}
 */
ZH.ui.LiveComponentPlugin.Op = {
  KEYDOWN: 1,
  KEYPRESS: 2,
  KEYUP: 3,
  SELECTION: 4,
  SHORTCUT: 5,
  EXEC_COMMAND: 6,
  QUERY_COMMAND: 7,
  PREPARE_CONTENTS_HTML: 8,
  CLEAN_CONTENTS_HTML: 10,
  CLEAN_CONTENTS_DOM: 11,
  CLICK: 12
};

/**
 * A map from plugin operations to the names of the methods that
 * invoke those operations.
 */
ZH.ui.LiveComponentPlugin.OPCODE = goog.object.transpose(
    goog.reflect.object(ZH.ui.LiveComponentPlugin, {
      handleKeyDown: ZH.ui.LiveComponentPlugin.Op.KEYDOWN,
      handleKeyPress: ZH.ui.LiveComponentPlugin.Op.KEYPRESS,
      handleKeyUp: ZH.ui.LiveComponentPlugin.Op.KEYUP,
      handleSelectionChange: ZH.ui.LiveComponentPlugin.Op.SELECTION,
      handleKeyboardShortcut: ZH.ui.LiveComponentPlugin.Op.SHORTCUT,
      handleClick: ZH.ui.LiveComponentPlugin.Op.CLICK,
      execCommand: ZH.ui.LiveComponentPlugin.Op.EXEC_COMMAND
      // queryCommandValue: ZH.ui.LiveComponentPlugin.Op.QUERY_COMMAND,
      // prepareContentsHtml: ZH.ui.LiveComponentPlugin.Op.PREPARE_CONTENTS_HTML,
      // cleanContentsHtml: ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_HTML,
      // cleanContentsDom: ZH.ui.LiveComponentPlugin.Op.CLEAN_CONTENTS_DOM
    }));
