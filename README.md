# ui-marionette_virtual_dom

Adds support for DOM diffing/patching to Marionette views.

## Installation

```
$ npm install ui-marionette_virtual_dom --save-dev
```

## Usage

In your app entry point, add the following:

```js
Marionette.enableVirtualDomViews([ options ]);
```

## Configuration
`enableVirtualDomViews` supports an `options` argument with the following settings:

- `overrideViewTypes` _(Boolean)_ - If set to `true`, the extension will modify directly the rendering methods of the views to enable with Virtual DOM support, with no backup definitions. If set to `false` (default), it'll create new classes derived from the selected view types.

- `implementForTypes` _(String[])_ - A list of type names, containing which Marionette types will be affected by the extension. Defaults to `['ItemView', 'CompositeView']`.

- `vDomTypePrefix` _(String)_ - If `overrideViewTypes` is set to `false`, the new view types will have a prefix. By default, it is `VDom`. This means, for example, that the extension will create `Marionette.VDomItemView` from `Marionette.ItemView` and `Marionette.VDomCompositeView` from `Marionette.CompositeView`.
