---
module: parcel
maintainer: Daniel Barreiro
title: SVG example
intro: "Drawing a circle in SVG"
includeexample: true
---
#The Basics#

Parcela is aware of namespaced elements such as `<svg>` or `<math>` elements or the `xmlns` element attribute.  It will use the proper namespaced function (`createElementNS` instead of `createElement`) when it is within a namespaced element.

```js
var v = ITSA.Parcel.vNode,
	SVG = ITSA.Parcel.subClass({
		view: function () {
			return v(
				'svg',
				{
					width:'200px',
					height:'150px'
				},
				v(
					'circle',
					{
						cx:"100",
						cy:"75",
						r:"50",
						fill:"#ff0000"
					}
				)
			);
		}
	});

ITSA.rootApp(new SVG());

```

We create a `SVG` parcel inheriting from the `Parcel` class.  We can freely use the `'svg'` tagName.  The renderer will recognize it as one needing special handling through namespaced DOM methods and will handle it properly as well as its child elements, such as the circle.

### Example

This is the result of running the code shown above. Right below you can find the full code in one piece:

### Complete Code

The full code for this example (the circle on the left hand side was generated via plain HTML):

```
ITSA = require('core');
ITSA.ready().then(
	function () {
		var v = ITSA.Parcel.vNode,
			SVG = ITSA.Parcel.subClass({
				view: function () {
					return [
						v('h1','Generated via Parcel'),
						v(
							'svg',
							{
								width:'200px',
								height:'150px'
							},
							v(
								'circle',
								{
									cx:"100",
									cy:"75",
									r:"50",
									fill:"#ff0000"
								}
							)
						)
					];
				}
			});

		ITSA.rootApp(new SVG());
	}
);
```
