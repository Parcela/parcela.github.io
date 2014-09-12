---
module: parcel
maintainer: Daniel Barreiro
title: Parcel events
intro: "This example is based on the tables-example. Only now we build 2 tables and create a tap-subscriber at the Class. When tap (or click) on the cells, they will be marked. Notice that both tables are running independently: the subscriber only listens for tap-events on its own table."
includeexample: true
---

###Complete Code###

```js
var Parcel = require('parcel'),
	Event = require("event/event-base.js"),
	EventDom = require('event-dom/event-dom.js'),
	ParcelEvents = require('parcel/events.js'),
    vdom = require('core-vdom')(window);


EventDom.mergeInto(Event);
ParcelEvents.mergeInto(Parcel, Event);

var v = vdom.vNode;

Parcel.vNode = vdom.vNode;

var data = [
    { id: 'ga-3475', name: 'gadget',   price: '$6.99' },
    { id: 'sp-9980', name: 'sprocket', price: '$3.75' },
    { id: 'wi-0650', name: 'widget',   price: '$4.25' }
];

var DataRow = Parcel.subClass({
    containerType: 'tr',
    view: function () {
        var tds = [],
            item = this.item,
            selectedCell = this.selectedCell,
            rowSelected = this.rowSelected;
        item.each(
            function(value, key) {
                var attrs = {
                    data: key
                };
                if (rowSelected && (selectedCell===key)) {
                    attrs.class = 'selected';
                }
                tds.push(v('td', attrs, value));
            }
        );
        return tds;
    }
});

var HeaderRow = Parcel.subClass({
    containerType: 'thead',
    init: function (config) {
        var ths = [];
        for (var c = 0; c < this.cols; c++) {
            ths.push(v('th', 'H' + c));
        }
        this.ths = ths;
    },
    view: function () {
        return v('tr', this.ths);
    }
});

var BodySection = Parcel.subClass({
    containerType: 'tbody',
    init: function (config) {
        var data = this.data;
        this.dataRows = [];
        for (var r = 0; r < data.length; r++) {
            this.dataRows[r] = new DataRow(Object.merge(config, {
                item: data[r]
            }));
        }
    },
    view: function () {
        return this.dataRows;
    }
});

var Table = Parcel.subClass({
    containerType: 'table',
    className: 'pure-table pure-table-horizontal',
    init: function (config) {
        this.header = new HeaderRow(config);
        this.body = new BodySection(config);
        this.after('click', this.markCell, 'td');
    },
    view: function () {
        return [
            this.header,
            this.body
        ];
    },
    markCell: function(e) {
        var bodyParcel = e.parcelTree[1],
            rowParcel = e.parcelTree[2],
            vNode = e.target;
        bodyParcel.dataRows.each(
            function(rowparcel) {
                rowparcel.rowSelected = (rowparcel===rowParcel);
            }
        );
        rowParcel.selectedCell = vNode.attrs.data;
    }
});

var WebApp = Parcel.subClass({
    init: function (config) {
        this.table1 = new Table({
            data: data
        });
        this.table2 = new Table({
            data: data
        });
    },
    view: function () {
        return [
            this.table1,
            v('br'),
            v('br'),
            this.table2
        ];
    }
});

var webApp = new WebApp();

vdom.rootApp(webApp);
```


