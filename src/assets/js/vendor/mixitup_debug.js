 /**! 
  * MixItUp Debug v1.0.0-beta
  * A MixItUp Extension
  *
  * @copyright Copyright 2014 KunkaLabs Limited.
  * @author    KunkaLabs Limited.
  * @link      https://mixitup.kunkalabs.com
  *
  * @license   To be used under the same terms as MixItUp core.
  *            https://mixitup.kunkalabs.com/licenses/
  */

 (function($, undf) {
     $.extend(true, $.MixItUp.prototype, {

         /* Extend Action Hooks
		---------------------------------------------------------------------- */

         _actions: {

             /**
              * Constructor
              */

             _constructor: {
                 post: {
                     debug: function() {
                         var self = this;

                         self.debug = {
                             enable: false,
                             mode: 'normal'
                         };
                     }
                 }
             },

             /**
              * Instantiate
              */

             _instantiate: {
                 pre: {
                     debug: function() {
                         var self = this,
                             domNode = arguments[0][0],
                             settings = arguments[0][1];

                         if (!settings.debug || !settings.debug.enable) return false;

                         if (!domNode.id) {
                             self._log({
                                 message: '[_instantiate] No container ID found. MixItUp will generate and apply a random ID.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }
                     }
                 }
             },

             /**
              * Platform Detect
              */

             _platformDetect: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         if (self._suckMode) {
                             self._log({
                                 message: '[_platformDetect] IE9 or lower detected. MixItUp will run without CSS3 transition support.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }

                         if (self._ff && self._ff <= 4) {
                             self._log({
                                 message: '[_platformDetect] Firefox 4 or earlier detected. MixItUp will run without CSS3 transition support.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }

                         if (self._ff && self._ff <= 20) {
                             self._log({
                                 message: '[_platformDetect] Firefox 20 or earlier detected. Transition-timing options will be limited. Please upgrade your browser.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }

                         if (self._chrome && self._chrome === 31) {
                             self._log({
                                 message: '[_platformDetect] Chrome 31 detected. Various bugs affecting MixItUp exist. Please upgrade your browser.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }

                         if (!window.requestAnimationFrame) {
                             self._log({
                                 message: '[_platformDetect] Unprefixed support for requestAnimationFrame not found. A polyfill will be applied.',
                                 type: 'warn',
                                 importance: 1
                             });
                         }
                     }
                 }
             },

             /**
              * Initialise
              */

             _init: {
                 post: {
                     debug: function() {
                         var self = this,
                             instancesCount = 0,
                             i;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[_init] MixItUp instantiated on container with ID "' + self._domNode.id + '".',
                             type: 'log',
                             importance: 1
                         });

                         for (i in self._instances) {
                             if (self._instances.hasOwnProperty(i)) {
                                 instancesCount++;
                             }
                         }

                         self._log({
                             message: '[_init] There are currently ' + instancesCount + ' instances of MixItUp in the document.',
                             type: 'log',
                             importance: 2
                         });
                     }
                 }
             },

             /**
              * Refresh
              */

             _refresh: {
                 post: {
                     debug: function() {
                         var self = this,
                             isInit = arguments[0];

                         if (!self.debug.enable) return false;

                         if (!arguments[0].length) {
                             self._log({
                                 message: '[_refresh] MixItUp refreshed. ' + self._$targets.length + ' targets were found and indexed.',
                                 type: 'log',
                                 importance: 3
                             });
                         }
                     }
                 }
             },

             /**
              * Bind Handlers
              */

             _bindHandlers: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         if (self.controls.live) {
                             self._log({
                                 message: '[_bindHandlers] liveControls mode enabled. The document body has been bound for click event delegation.',
                                 type: 'log',
                                 importance: 2
                             });
                         } else {
                             if (self._$sortButtons.length) {
                                 self._log({
                                     message: '[_bindHandlers] ' + self._$sortButtons.length + ' sort buttons found.',
                                     type: 'log',
                                     importance: 2
                                 });
                             }

                             if (self._$filterButtons.length) {
                                 self._log({
                                     message: '[_bindHandlers] ' + self._$filterButtons.length + ' filter buttons found.',
                                     type: 'log',
                                     importance: 2
                                 });
                             }
                         }
                     }
                 }
             },

             /**
              * Process Click
              */

             _processClick: {
                 pre: {
                     debug: function() {
                         var self = this,
                             type = arguments[0][1],
                             $button = arguments[0][0];

                         if (!self.debug.enable) return false;

                         if (type === 'sort') {
                             var command = $button.attr('data-sort');

                             self._log({
                                 message: '[_processClick] A sort button with command "' + command + '" was clicked.',
                                 type: 'log',
                                 importance: 2
                             });
                         }

                         if (type === 'filter') {
                             var command = $button.attr('data-filter');

                             if (!self.controls.toggleFilterButtons) {

                                 self._log({
                                     message: '[_processClick] A filter button with command "' + command + '" was clicked.',
                                     type: 'log',
                                     importance: 2
                                 });

                             } else {

                                 self._log({
                                     message: '[_processClick] A filter button with command "' + command + '" was toggled on or off.',
                                     type: 'log',
                                     importance: 2
                                 });

                             }
                         }
                     }
                 }
             },

             _processClickBusy: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[_processClick] A button was clicked but MixItUp was busy and queuing is disabled. The request was ignored.',
                             type: 'warn',
                             importance: 1
                         });
                     }
                 }
             },

             /**
              * Bind Target Done
              */

             _bindTargetDone: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[_bindTargetDone] Target bound for transition-end.',
                             type: 'log',
                             importance: 3
                         });

                     }
                 }
             },

             /**
              *
              */

             _targetDone: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[_targetDone] Transition-end detected. Target done.',
                             type: 'log',
                             importance: 3
                         });

                     }
                 }
             },

             /**
              * CleanUp
              */

             _cleanUp: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         if (!self._loading) {

                             self._log({
                                 message: '[_cleanUp] The operation completed successfully.',
                                 type: 'log',
                                 importance: 2
                             });

                         } else {

                             self._log({
                                 message: '[_cleanUp] Loading animation completed successfully.',
                                 type: 'log',
                                 importance: 2
                             });

                         }
                     }
                 }
             },

             /**
              *
              */

             _queue: {
                 pre: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[multiMix] Loading operation from queue. There are ' + (self._queue.length - 1) + ' operations left in the queue.',
                             type: 'log',
                             importance: 2
                         });
                     }
                 }
             },

             /**
              * MultiMix
              */

             multiMix: {
                 pre: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         if (!self._clicking) {
                             self._log({
                                 message: '[multiMix] Operation requested via the API.',
                                 type: 'log',
                                 importance: 2
                             });
                         }
                     }
                 },
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[multiMix] Operation started.',
                             type: 'log',
                             importance: 2
                         });
                     }
                 }
             },

             multiMixQueue: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[multiMix] An operation was requested but MixItUp was busy. The operation was added to the queue in position ' + self._queue.length + '.',
                             type: 'warn',
                             importance: 1
                         });
                     }
                 }
             },

             multiMixBusy: {
                 post: {
                     debug: function() {
                         var self = this;

                         if (!self.debug.enable) return false;

                         self._log({
                             message: '[multiMix] An operation was requested but MixItUp was busy and queuing is disabled. The request was ignored.',
                             type: 'warn',
                             importance: 1
                         });
                     }
                 }
             }
         },

         /* Private Methods
		---------------------------------------------------------------------- */

         _log: function(obj) {
             var self = this,
                 id = self._domNode ? self._domNode.id : 'undefined';

             if (console === undf) return false;

             if (
                 (self.debug.mode === 'verbose' && obj.importance <= 3) ||
                 (self.debug.mode === 'normal' && obj.importance <= 2) ||
                 (self.debug.mode === 'quiet' && obj.importance === 1)
             ) {
                 console[obj.type]('[MixItUp][' + id + ']' + obj.message);
             }
         }

     });

 }) /*(jQuery)*/ ;