/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names, no-unused-expressions,
   prefer-template, object-shorthand, import/no-extraneous-dependencies */


const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const jsdom = require('jsdom');

global.document = jsdom.jsdom('<body><div>1</div></body>');
global.window = document.defaultView;

const Marionette = require('backbone.marionette');

require('../dist/marionette.virtual-dom');

const ItemView = Marionette.ItemView.extend({});
const CompositeView = Marionette.CompositeView.extend({});

describe('Marionette.VirtualDom', function () {
  it('should define a method `enableVirtualDomViews` in Marionette', function () {
    expect(Marionette.enableVirtualDomViews).to.be.a('function');
  });
  it('should define a method `disableVirtualDomViews` in Marionette', function () {
    expect(Marionette.disableVirtualDomViews).to.be.a('function');
  });
  describe('#enableVirtualDomViews', function () {
    describe('should create new implementations when `overrideViewTypes` is false', function () {
      before(function () {
        Marionette.enableVirtualDomViews({ overrideViewTypes: false });
      });

      it('on ItemView', function () {
        expect(new ItemView({ model: {} }).usesVirtualDom).to.be.undefined;
        expect(new Marionette.VDomItemView({ model: {} }).usesVirtualDom).to.be.true;
      });

      it('on CompositeView', function () {
        expect(new CompositeView({ model: {} }).usesVirtualDom).to.be.undefined;
        expect(new Marionette.VDomCompositeView({ model: {} }).usesVirtualDom).to.be.true;
      });
    });
    describe('should overwrite implementations when `overrideViewTypes` is true', function () {
      before(function () {
        Marionette.enableVirtualDomViews({ overrideViewTypes: true });
      });

      it('on ItemView', function () {
        expect(new ItemView({ model: {} }).usesVirtualDom).to.be.undefined;
        expect(new Marionette.ItemView({ model: {} }).usesVirtualDom).to.be.true;
      });

      it('on CompositeView', function () {
        expect(new CompositeView({ model: {} }).usesVirtualDom).to.be.undefined;
        expect(new Marionette.CompositeView({ model: {} }).usesVirtualDom).to.be.true;
      });

      after(function () {
        Marionette.disableVirtualDomViews();
      });
    });
  });
});
