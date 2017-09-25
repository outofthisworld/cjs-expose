# Expose [![Build Status](https://travis-ci.org/outofthisworld/exposed.svg?branch=master)](https://travis-ci.org/outofthisworld/exposed)

Expose is a simple utility tool for exposing private variables and
functions from within a commonJs module.

# Usage

```javascript
    //mymodule.js
    const myPrivateVar = 1;


    function myPrivateFunction() {

    }

    let myOtherPrivateFunction = function() {

    }

    //myothermodule.js
    const expose = require('expose');

    const f = expose('./mymodule.js','myPrivateFunction');
    //output: [function myPrivateFunction]

    // Expose also accepts an array of arguments, given that array length > 1
    // the return value will always be an object with keys and values.
    // Else, if one array value or a string is given the return value
    // be the actual requested value.
    const f = expose('./mymodule.js',['myPrivateFunction','myOtherPrivateFunction');
    /*
        output: {
            myPrivateFunction:[function myPrivateFunction],
            myOtherPrivateFunction:[function myOtherPrivateFunction]
        }
    */


```