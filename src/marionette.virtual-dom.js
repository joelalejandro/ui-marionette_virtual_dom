const { diff, patch } = require('virtual-dom');
const { createVNode } = require('vdom-virtualize-redist');
const _ = require('underscore');
const Marionette = require('backbone.marionette');

const applyVirtualDomMixinOnType = (view) => {
  return view.extend({
    usesVirtualDom: true,

    setElement() {
      // eslint-disable-next-line prefer-rest-params
      view.prototype.setElement.apply(this, arguments);

      if (this.el) {
        this.rootTemplate = _.template(
          this.el.outerHTML.replace(/>(.|\n)*<\//, '><%= content %></')
        );
      }
    },

    attachElContent(html) {
      const newVirtualEl = createVNode($(this.rootTemplate({
        content: Backbone.$.trim(html),
      }))[0]);
      if (this.virtualEl) {
        const patches = diff(this.virtualEl, newVirtualEl);
        patch(this.el, patches);
      } else {
        this.$el.html(Backbone.$.trim(html));
      }
      this.virtualEl = newVirtualEl;
      return this;
    },

    remove() {
      this.virtualEl = this.rootTemplate = null;

      // eslint-disable-next-line prefer-rest-params
      view.prototype.remove.apply(this, arguments);
    },
  });
};

const defaultOptions = {
  overrideViewTypes: false,
  implementForTypes: ['ItemView', 'CompositeView'],
  vDomTypePrefix: 'VDom',
};

Marionette.virtualDomSettings = {};

Marionette.enableVirtualDomViews = (options) => {
  const settings = Object.assign({}, defaultOptions, options);

  Marionette.virtualDomSettings = settings;

  if (settings.overrideViewTypes) {
    Marionette.virtualDomSettings.originalTypes = settings.implementForTypes.map(
      type => Object.assign({}, Marionette[type])
    );
  }

  settings.implementForTypes.forEach((type) => {
    const appliedType = settings.overrideViewTypes
      ? type
      : (`${settings.vDomTypePrefix}${type}`);
    Marionette[appliedType] = applyVirtualDomMixinOnType(Marionette[type]);
  });
};

Marionette.disableVirtualDomViews = () => {
  const options = Marionette.virtualDomSettings;

  if (!options || !options.overrideViewTypes) {
    return;
  }

  options.implementForTypes.forEach((type) => {
    Marionette[type] = options.originalTypes[type];
  });
};
