YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Event",
        "Event.Emitter",
        "Event.Listener",
        "Function",
        "IO",
        "Object",
        "Parcel",
        "Parcel.EventListener",
        "Parcel.Listener",
        "Promise",
        "Router",
        "Utils",
        "vDOM",
        "vNode"
    ],
    "modules": [
        "Object",
        "Promise",
        "core",
        "core-routing",
        "event",
        "event-dom",
        "event-emitter",
        "event-hammerjs",
        "event-listener",
        "io",
        "io-assets",
        "io-cors",
        "io-jsonp",
        "io-node",
        "io-transfer",
        "io-win",
        "io-xml",
        "parcel",
        "parcel-event-listener",
        "promise-ext",
        "utils",
        "virtual-dom"
    ],
    "allModules": [
        {
            "displayName": "core",
            "name": "core"
        },
        {
            "displayName": "core-routing",
            "name": "core-routing",
            "description": "Provides routing services.\n\nThe module exports a single function which should be called to \nfetch the [Router](../classes/Router.html) class.\n\nThe function must be passed a reference to the DOM `window` object\nor a reasonable substitute.\nFor modules to be loaded through Browserify, \nthis is usually `global.window`.  For modules loaded both through\nBrowserify or node, assuming a suitable emulator, it can be\ndone like this:\n \n```   \nvar vDOM = require('virtual-dom')(global.window || require('dom-window-emulator'));\n```"
        },
        {
            "displayName": "event",
            "name": "event",
            "description": "Defines the Event-Class, which should be instantiated to get its functionality\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE"
        },
        {
            "displayName": "event-dom",
            "name": "event-dom",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "event-emitter",
            "name": "event-emitter",
            "description": "Extends the Event-instance by adding the method `Emitter` to it.\nThe `Emitter-method` returns an object that should be merged into any Class-instance or object you\nwant to extend with the emit-methods, so the appropriate methods can be invoked on the instance.\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-hammerjs",
            "name": "event-hammerjs",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `init`-method like this:"
        },
        {
            "displayName": "event-listener",
            "name": "event-listener",
            "description": "Extends the Event-instance by adding the object `Listener` to it.\nThe returned object should be merged into any Class-instance or object you want to\nextend with the listener-methods, so the appropriate methods can be invoked on the instance.\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "io",
            "name": "io"
        },
        {
            "displayName": "io-assets",
            "name": "io-assets",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-cors",
            "name": "io-cors",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-jsonp",
            "name": "io-jsonp",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-node",
            "name": "io-node",
            "description": "Provides core IO-functionality for NodeJS in the same way as 'io-win.js' does on the browser.\n This way, all IO-methods can be used inside nodejs as well."
        },
        {
            "displayName": "io-transfer",
            "name": "io-transfer",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "io-win",
            "name": "io-win",
            "description": "Provides core IO-functionality.\n\nThe returned xhr DOES support CORS for all modern browsers.\nTo use CORS, you need to setup the responseserver right\nMore info about CORS: http://remysharp.com/2011/04/21/getting-cors-working/\n\n\n\n\nTODO: make STREAMING with IE9-browsers work: the XDomainRequest() seems not to fire the onprogress-event...\n      (and XMLHttpRequest1 doesn't have this event at all)\nTODO: make CORS with IE9-browsers work: the XDomainRequest() fails currently on cors..\n\n\n\n\nUsing CORS with IE9-browsers need special consideration, for it uses the XDomainRequest():\n1. Only GET and POST methods are supported. Other methods will be reset into one of these,\n   so make sure the cross-domain-server handles all requests as being send with the GET or POST method.\n2. Only text/plain is supported for the request's Content-Type header. This will lead into troubles when handling\n   POST-requests: the cross-domain-server needs to extract the parameters itself. For nodejs, there is a nice npm module:\n   `express-ie-cors` https://github.com/advanced/express-ie-cors/blob/master/lib/express-ie-cors.js\n3. No custom headers can be added to the request.\n4. No authentication or cookies will be sent with the request.\nmore info: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx"
        },
        {
            "displayName": "io-xml",
            "name": "io-xml",
            "description": "Extends io by adding the method `readXML` to it.\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "Object",
            "name": "Object",
            "description": "Pollyfils for often used functionality for objects and Functions"
        },
        {
            "displayName": "parcel",
            "name": "parcel",
            "description": "All Parcela apps should inherit from this class.\n\nThe constructor ensures the `config` argument exists and is an object.\nIt merges the values from the [`defaultConfig`](#property_defaultConfig) property into it and\nsets the properties of the instance to the resulting values.\nIt then calls the `init` method with all its arguments.\nThe [`init`](#method_init) might be considered the true constructor of the parcel."
        },
        {
            "displayName": "parcel-event-listener",
            "name": "parcel-event-listener",
            "description": "Extends the Event-instance by adding the object `listener` to it.\nThe returned object should be merged into any Class-instance or object you want to\nextend with the listener-methods, so the appropriate methods can be invoked on the instance.\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "Promise",
            "name": "Promise"
        },
        {
            "displayName": "promise-ext",
            "name": "promise-ext",
            "description": "Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,\nBut are all Promise/A+ compatable."
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Collection of various utility functions."
        },
        {
            "displayName": "virtual-dom",
            "name": "virtual-dom",
            "description": "Provides virtual dom functionality for other modules.\n\nThe module exports a single function which should be called to\nfetch the [vDOM](../classes/vDOM.html) class.\n\nThe function must be passed a reference to the DOM `window` object\nor a reasonable substitute.\nFor modules to be loaded through Browserify,\nthis is usually `global.window`.  For modules loaded both through\nBrowserify or node, assuming a suitable emulator, it can be\ndone like this:\n\n```\n   var vDOM = require('virtual-dom')(global.window || require('dom-window-emulator'));\n```"
        }
    ]
} };
});