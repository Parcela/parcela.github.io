---
module: event-dom
maintainer: Marco Asbreuk
title: Preventing DOM-events
intro: "Events can be prevented by using a before-subscriber. Normally you would have logic here to determine whether or not preventDefault: this example preventDefaults always."
---

Click on the button: no alert will come.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Click me</button>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Click me</button>
</body>
```

```js
var afterClick = function(e) {
    // the alert will never pop-up
    alert('Button #buttongo is clicked');
};
var beforeClick = function(e) {
    e.preventDefault();
};

Event.before('click', beforeClick, '#buttongo');
Event.after('click', afterClick, '#buttongo');
```

<script src="../../assets/core.js"></script>
<script>
    ITSA = require('core');
    ITSA.ready().then(
        function() {
            var afterClick = function(e) {
                // the alert will never pop-up
                alert('Button #buttongo is clicked');
            };
            var beforeClick = function(e) {
                e.preventDefault();
            };

            ITSA.Event.before('click', beforeClick, '#buttongo');
            ITSA.Event.after('click', afterClick, '#buttongo');
        }
    );
</script>