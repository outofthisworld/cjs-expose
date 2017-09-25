"use strict"

const fs = require('fs');
const path = require('path')


module.exports = function(modulePath, keys, encoding) {
    encoding = encoding || 'utf8';

    if (!modulePath) {
        throw new Error('Path must be supplied to expose');
    }

    if (!Array.isArray(keys) && typeof keys !== 'string') {
        throw new Error('Invalid data type passed to expose');
    }

    const keyIsString = typeof keys === 'string';
    keys = keyIsString ? [keys] : keys;

    function wrap(script) {
        script = script.replace(/module.exports(\s)*=(\s)*[^}|'|"|;]*[}|'|"|;|1-9]/g, '//')
        script = script.replace(/exports./g, 'let ');

        script += '\nmodule.exports = { ';

        for (let i = 0; i < keys.length; i++) {
            script += keys[i] + ':' + keys[i];
            if (i != keys.length - 1) {
                script += ',';
            }
        }
        script += ' }';

        return script;
    }


    let script = wrap(fs.readFileSync(modulePath, encoding));


    const tempFilePath = path.join(__dirname, 'temp', 'temp' + require('uuid').v4() + '.js');

    fs.writeFileSync(tempFilePath, script, encoding);

    function deleteTempFile() {
        try {
            fs.unlinkSync(tempFilePath);
        } catch (err) {}
    }

    let out;
    try {
        out = require(tempFilePath);
    } catch (err) {
        deleteTempFile();
        throw err;
    }


    out = keyIsString ? out[keys] : keys.length == 1 ? out[keys[0]] : out;
    deleteTempFile();

    return out;
}