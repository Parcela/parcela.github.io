---
module: event-hammer
maintainer: Marco Asbreuk
title: tripletap-events
intro: "Gesture-events can be listened by without an emitterName. By using the `filter`-argument you specify which node to listen to. Because the filter (selector) is a String, we can pass it as 3rd parameter."
---

<style type="text/css">
    #addbtn-container {
        margin: 2em 0;
        min-height: 2em;
    }
</style>

Tripple-tap on the `Show popup` to show a pop-up.

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
    var showMsg = function(e) {
        alert('Button was triple tapped');
    };

    Event.after('tripletap', showMsg, '#buttongo');
</script>
```


<script src="../../assets/core.js"></script>
<script>
    ITSA = require('core');
    ITSA.ready().then(
        function() {
            var showMsg = function(e) {
                alert('Button was triple tapped');
            };

            ITSA.Event.after('tripletap', showMsg, '#buttongo');
        }
    );
</script>
