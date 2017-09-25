const myPrivateVar = 1;


function myPrivateFunction() {
    return myOtherPrivateFunction();
}

let myOtherPrivateFunction = function() {
    return 1;
}