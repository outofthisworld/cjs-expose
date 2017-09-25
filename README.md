# cjs-expose [![Build Status](https://travis-ci.org/outofthisworld/exposed.svg?branch=master)](https://travis-ci.org/outofthisworld/cjs-expose)

cjs-expose is a simple utility tool for exposing private variables and
functions from within a commonJs module.

# Usage

```javascript
    //====== MODULE mymodule.js ======

    const myPrivateVar = 1;


    function myPrivateFunction() {

    }

    let myOtherPrivateFunction = function() {

    }
    
    //==========END MODULE================

    //====== MODULE myothermodule.js ======

    const expose = require('cjs-expose');
    const myAccessor = expose('./mymodule.js');

    console.log(myAccessor('myPrivateFunction'));
    //output: [function myPrivateFunction]

    console.log(myAccessor('myOtherPrivateFunction'));
    //output: [function myOtherPrivateFunction]

    console.log(myAccessor('myPrivateVar'));
    //output: 1

    console.log(myAccessor(['myOtherPrivateFunction']));
    //output: [function myOtherPrivateFunction]

    console.log(['myPrivateFunction','myOtherPrivateFunction'])
    /*
        output: {
            myPrivateFunction:[function myPrivateFunction],
            myOtherPrivateFunction:[function myOtherPrivateFunction]
        }
    */

   //==========END MODULE================
```