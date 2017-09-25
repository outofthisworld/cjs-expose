"use strict"

const fs = require('fs');
const path = require('path')


const wrapScript = function(script, vars) {
    const repl = /module.exports(\s)*=(\s)*[^}|'|"|;]*[}|'|"|;|1-9]/g;
    const expo = /exports./g;

    script = script.replace(repl, '//')
    script = script.replace(expo, 'let ');

    script += '\n';
    script += 'module.exports = { ';


    for (let i = 0; i < vars.length; i++) {
        script += vars[i] + ':' + vars[i];
        if (i != vars.length - 1) {
            script += ',';
        }
    }
    script += ' }';

    return script;
}


module.exports = function(modulePath, encoding) {
    encoding = encoding || 'utf8';

    if (!modulePath) {
        throw new Error('Path must be supplied to expose');
    }

    return function(vars) {
        if (!Array.isArray(vars) && typeof vars !== 'string') {
            throw new Error('Invalid data type passed to expose');
        }

        const varIsString = typeof vars === 'string';
        vars = varIsString ? [vars] : vars;

        let script = wrapScript(fs.readFileSync(modulePath, encoding), vars);


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


        out = varIsString ? out[vars] : vars.length == 1 ? out[vars[0]] : out;
        deleteTempFile();

        return out;
    }
}