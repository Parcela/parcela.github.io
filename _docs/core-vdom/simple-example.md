---
module: core-vdom
maintainer: Deva Satyam
title: Simple example vdom
intro: "This is the intro to this example of vDOM"
---
#The Basics#

Here your content

Code-example:

```js
var node = PA.one('#container1');
node.setHTML('some <b>new content</b>');
```
<!--
<script src="../../../build/core/core-min.js"></script>
<script>
    ITSA.ready().then(
        function() {
            // enter your code here
        }
    );
</script>
-->