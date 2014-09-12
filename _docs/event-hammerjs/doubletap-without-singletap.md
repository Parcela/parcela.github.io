---
module: event-hammer
maintainer: Marco Asbreuk
title: doubletap without singletap
intro: "Normally, doubletap will emit a doubletap event and two singletap events. To prevent this, use Event.Hammer.requireFailure on both doubletap and tripletap. Not however, that a tap-event (single) will always wait until it is sure there was no double or tripletap. Therefore the userexperience will be slowered down."
---

<style type="text/css">
    #addbtn-container {
        margin: 2em 0;
        min-height: 2em;
    }
</style>

Doubletap on the `Show popup` to show a pop-up. Notice that the popup changes based on a single or doubletap.

<div id="addbtn-container">
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</div>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</body>
```

```js
<script>
    var showMsgSingle = function(e) {
        alert('Button was single tapped');
    };
    var showMsgDouble = function(e) {
        alert('Button was double tapped');
    };

    var singletap = Event.Hammer.get('tap');
    var doubletap = Event.Hammer.get('doubletap');
    var tripletap = Event.Hammer.get('tripletap');

    singletap.requireFailure([tripletap, doubletap]);

    Event.after('tap', showMsgSingle, '#buttongo');
    Event.after('doubletap', showMsgDouble, '#buttongo');
</script>
```


<script src="../../assets/core.js"></script>
<script>
    ITSA = require('core');
    ITSA.ready().then(
        function() {
            var showMsgSingle = function(e) {
                alert('Button was single tapped');
            };
            var showMsgDouble = function(e) {
                alert('Button was double tapped');
            };

            var singletap = ITSA.Event.Hammer.get('tap');
            var doubletap = ITSA.Event.Hammer.get('doubletap');
            var tripletap = ITSA.Event.Hammer.get('tripletap');

            singletap.requireFailure([tripletap, doubletap]);

            ITSA.Event.after('tap', showMsgSingle, '#buttongo');
            ITSA.Event.after('doubletap', showMsgDouble, '#buttongo');

        }
    );
</script>
