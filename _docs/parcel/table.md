---
module: parcel
maintainer: Daniel Barreiro
title: Nested parcels
intro: "Building a table out of nested Parcels"
includeexample: true
---
#The Basics#

We will build a table made of several Parcels nested within one another.  First we will make a Parcel for the table itself:

```js
var Table = ITSA.Parcel.subClass({
	containerType: 'table',
	className: 'pure-table',
	init: function (config) {
		this.header = new HeaderRow(config);
		this.body = new BodySection(config);
	},
	view: function () {
		return [
			this.header,
			this.body
		];
	}
});
```

We declare the `Table` parcel to use a `table` element as its container and, since we are using [Pure CSS](http://purecss.io/tables/) we set the required `className`.  Our table will be made of two sub-views, one for the header and one for the body.  They are both instanced in the `init` method passing them the same configuration options the table would receive on instantiation.

Those same two instances are then returned as an array in the `view`.  A `view` can return either a simple value, which will create a node of type text, a `vNode` or an instance of a Parcel, or an array of those elements in any combination.  Here, it returns an array made of those two parcel instances.  We can easily add a caption:

```
view: function () {
	return [
		this.header,
		this.body,
		this.caption && v('caption', this.caption)
	];
}
```

We check whether a `caption` configuration option was set and if so, add to the returned array a `vNode` made of a `caption` element containing the text of the caption.  If not `caption` was configured, the array would contain an `undefined` item, which will be ignored.

The table can be created like this:

```
var table = new Table({
	rows:4,
	cols:5,
	caption:'this is the caption'
});

ITSA.rootApp(table, document.getElementById('example_div'));
```

We create the `Table` instance passing it the number of rows and columns we want and a caption.  In a more realistic scenario, when creating the instance we would also be passing it more information such as an array with labels for the columns and a reference to the data to display.  In this case, we will simply fill up the table with row and column indexes.

The `table` Parcel instance is then set as the `rootApp` for the application.  A Parcel can coexist with prior content, as it is doing in this page, [down below](#example).  Thus, this page has a `<div id="example_div"></div>` that we want to become the root of our single-page application.  If we don't provide this second argument, Parcela will use `document.body` as its root element.

As it is, the table would crash if we failed to provide the number of rows and columns.  We can avoid that risk by adding a `defaultConfig` property to ensure that even if no configuration options are passed to the constructor on instantiation, the Parcel will render something usable:

```
defaultConfig: {
	rows:2,
	cols:2
},
```

### The sub-views

The `Table` parcel relies on two other parcels to create its header and body sections, shown here:

```
var HeaderRow = ITSA.Parcel.subClass({
	containerType: 'thead',
	init: function (config) {
		var ths = [];
		for (var c = 0; c < this.cols; c++){
			ths.push(v('th', 'H' + c));
		}
		this.ths = ths;
	},
	view: function () {
		return v('tr', this.ths);
	}
});

var BodySection = ITSA.Parcel.subClass({
	containerType: 'tbody',
	init: function (config) {
		this.dataRows = [];
		for (var r = 0; r < this.rows; r++) {
			this.dataRows[r] = new DataRow(Object.merge(config,{row:r}));
		}
	},
	view: function () {
		return this.dataRows;
	}
});
```

They are both simple Parcel instances having their `containerType` set to `thead` and `tbody` elements.  The `HeaderRow` view returns a `vNode` made of a `tr` element with an array of `th` `vNode`s asembled in the `init` method based on the number of columns. For the body section, the rows are `DataRow` Parcels assembled in the `init` method as well.

The choice of assembling the header cells or the data rows in the `init` or in the `view` method depends on the application. The `init` method is called only once when the Parcel is created, the `view` method is called every time the full screen or this Parcel is refreshed.  Thus, depending on how dynamic the configuration of the table is, the developer can choose where to assemble the elements.  In this case, the table is mostly static so we do it in the `init` method which so everything is ready made for rendering and later refreshes.

Finally, the `DataRow`:

```
	var DataRow = ITSA.Parcel.subClass({
		containerType: 'tr',
		view: function () {
			var tds = [];
			for (var c = 0;c < this.cols; c++){
				tds.push(v('td','r'+ this.row + '-c' + c));
			}
			return tds;
		}
	});
```

In this case, to show the alternative, the data cells are assembled in the `view` method.  It is not as efficient as having them pre-assembled in the `init` method but, if the data came from an external source and was likely to change, the data cells would be immediately refreshed.

### Live example

This is the result of running the code shown above.  Right below you can find the full code in one piece:

### Complete Code

The full code for this example:

```
ITSA = require('core');
ITSA.ready().then(
	function() {
		var v = ITSA.Parcel.vNode;


		var DataRow = ITSA.Parcel.subClass({
			containerType: 'tr',
			view: function () {
				var tds = [];
				for (var c = 0;c < this.cols; c++){
					tds.push(v('td','r'+ this.row + '-c' + c));
				}
				return tds;
			}
		});

		var HeaderRow = ITSA.Parcel.subClass({
			containerType: 'thead',
			init: function (config) {
				var ths = [];
				for (var c = 0; c < this.cols; c++){
					ths.push(v('th', 'H' + c));
				}
				this.ths = ths;
			},
			view: function () {
				return v('tr', this.ths);
			}
		});

		var BodySection = ITSA.Parcel.subClass({
			containerType: 'tbody',
			init: function (config) {
				this.dataRows = [];
				for (var r = 0; r < this.rows; r++) {
					this.dataRows[r] = new DataRow(Object.merge(config,{row:r}));
				}
			},
			view: function () {
				return this.dataRows;
			}
		});

		var Table = ITSA.Parcel.subClass({
			containerType:'table',
			className:'pure-table',
			defaultConfig: {
				rows:2,
				cols:2
			},
			init: function (config) {
				this.header = new HeaderRow(config);
				this.body = new BodySection(config);
			},
			view: function () {
				return [
					this.header,
					this.body,
					this.caption && v('caption', this.caption)
				];
			}
		});

		var table = new Table({
			rows:4,
			cols:5,
			caption:'this is the caption'
		});

		ITSA.rootApp(table);
	}
);
```


