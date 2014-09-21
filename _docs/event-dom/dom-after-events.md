---
module: event-dom
maintainer: Marco Asbreuk
title: DOM after-events
intro: "DOM-events do not have after-listeners by default. However, <b>event-dom</b> has.<br>You can type anything in the text-box and the event shows the new value."
---

Code-example:

```
<body>
    <div id="input-container">
        <input id="example" />
    </div>
    <div id="container"></div>
</body>
```

```
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var container = document.getElementById('container');

    var showMsg = function(e) {
        container.innerHTML = e.target.value;
    };

    Parcela.Event.after('keypress', showMsg, '#example');
</script>
```
