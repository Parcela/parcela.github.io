---
module: event
maintainer: Marco Asbreuk
title: Custom made events
intro: "Custom Made Events are customevents that are defined by Event.defineEvent(). They differ from DOM-events in a way that they have to be defined manually by the programmer; DOM-events are customevents which are created automaticly."
---

Click on the button to save the profile.

<button id="save" class="pure-button pure-button-primary pure-button-bordered">Save profile</button>

Code-example:

```html
<body>
    <button id="save" class="pure-button pure-button-primary pure-button-bordered">Save profile</button>
</body>
```

```js
var Profile = Object.createClass(null, Event.Emitter('PersonalProfile')),
    myProfile = new Profile();

myProfile.defineEvent('save') // defines "PersonalProfile:save"
         .defaultFn(function(e) {
             alert('personal profile was saved');
         });

Event.after('click', function() {
    myProfile.emit('save');
}, '#save');
```


<script src="../../assets/core.js"></script>
<script>
    ITSA = require('core');
    ITSA.ready().then(
        function() {
            var Profile = Object.createClass(null, ITSA.Event.Emitter('PersonalProfile')),
                myProfile = new Profile();

            myProfile.defineEvent('save') // defines "PersonalProfile:save"
                     .defaultFn(function(e) {
                         alert('personal profile was saved');
                     });

            ITSA.Event.after('click', function() {
                myProfile.emit('save');
            }, '#save');
        }
    );
</script>