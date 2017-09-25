const expose = require('../index');
const assert = require('assert');

//Tests
describe('expose tests', function() {
    it('throws an error when no path given', function() {
        assert.throws(function() { expose(undefined) }, Error);
    })

    it('throws an error when second argument is not string or array - number', function() {
        assert.throws(function() { expose('')(1) }, Error);
    })

    it('throws an error when second argument is not string or array - object', function() {
        assert.throws(function() { expose('')({}) }, Error);
    })

    it('does not error given right parameters', function() {
        assert.doesNotThrow(expose('./test/test_mock.js')(['myPrivateFunction']));
    })

    it('returns a private function at top level', function() {
        const myPrivateFunc = expose('./test/test_mock.js')(['myPrivateFunction'])
        assert.equal(typeof myPrivateFunc, 'function');
    })

    it('returns a private function at top level 2', function() {
        const myOtherPrivateFunction = expose('./test/test_mock.js', 'utf8')('myOtherPrivateFunction')
        assert.equal(typeof myOtherPrivateFunction, 'function');
    })

    it('returns object when array length > 1', function() {
        const obj = expose('./test/test_mock.js', 'utf8')(['myPrivateVar', 'myOtherPrivateFunction'])
        assert.equal(typeof obj, 'object');
    })

    it('has right keys and values in returned object', function() {
        const obj = expose('./test/test_mock.js', 'utf8')(['myPrivateVar', 'myOtherPrivateFunction'])
        assert.equal(obj.myPrivateVar, 1);
        assert.equal(typeof obj.myOtherPrivateFunction, 'function');
    })

    it('returns a private variable', function() {
        const myPrivateVar = expose('./test/test_mock.js', 'utf8')('myPrivateVar')
        assert.equal(myPrivateVar, 1);
    })

    it('returns the result of calling non-exported function', function() {
        const myPrivateFunction = expose('./test/test_mock.js', 'utf8')('myPrivateFunction')
        assert.equal(myPrivateFunction(), 1);
    })
})