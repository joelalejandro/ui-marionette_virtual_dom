(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['virtual-dom', 'vdom-virtualize-redist', 'underscore', 'backbone.marionette'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('virtual-dom'), require('vdom-virtualize-redist'), require('underscore'), require('backbone.marionette'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.virtualDom, global.vdomVirtualizeRedist, global.underscore, global.backbone);
    global.marionetteVirtualDom = mod.exports;
  }
})(this, function (_require, _require2, _, Marionette) {
  'use strict';

  var diff = _require.diff,
      patch = _require.patch;
  var createVNode = _require2.createVNode;


  var applyVirtualDomMixinOnType = function applyVirtualDomMixinOnType(view) {
    return view.extend({
      usesVirtualDom: true,

      setElement: function setElement() {
        // eslint-disable-next-line prefer-rest-params
        view.prototype.setElement.apply(this, arguments);

        if (this.el) {
          this.rootTemplate = _.template(this.el.outerHTML.replace(/>(.|\n)*<\//, '><%= content %></'));
        }
      },
      attachElContent: function attachElContent(html) {
        var newVirtualEl = createVNode($(this.rootTemplate({
          content: Backbone.$.trim(html)
        }))[0]);
        if (this.virtualEl) {
          var patches = diff(this.virtualEl, newVirtualEl);
          patch(this.el, patches);
        } else {
          this.$el.html(Backbone.$.trim(html));
        }
        this.virtualEl = newVirtualEl;
        return this;
      },
      remove: function remove() {
        this.virtualEl = this.rootTemplate = null;

        // eslint-disable-next-line prefer-rest-params
        view.prototype.remove.apply(this, arguments);
      }
    });
  };

  var defaultOptions = {
    overrideViewTypes: false,
    implementForTypes: ['ItemView', 'CompositeView'],
    vDomTypePrefix: 'VDom'
  };

  Marionette.virtualDomSettings = {};

  Marionette.enableVirtualDomViews = function (options) {
    var settings = Object.assign({}, defaultOptions, options);

    Marionette.virtualDomSettings = settings;

    if (settings.overrideViewTypes) {
      Marionette.virtualDomSettings.originalTypes = settings.implementForTypes.map(function (type) {
        return Object.assign({}, Marionette[type]);
      });
    }

    settings.implementForTypes.forEach(function (type) {
      var appliedType = settings.overrideViewTypes ? type : '' + settings.vDomTypePrefix + type;
      Marionette[appliedType] = applyVirtualDomMixinOnType(Marionette[type]);
    });
  };

  Marionette.disableVirtualDomViews = function () {
    var options = Marionette.virtualDomSettings;

    if (!options || !options.overrideViewTypes) {
      return;
    }

    options.implementForTypes.forEach(function (type) {
      Marionette[type] = options.originalTypes[type];
    });
  };
});