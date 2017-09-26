"use strict"

const fs = require('fs');
const path = require('path')


const wrapScript = function(script, vars) {

    script += '\n';
    script += `module.exports = { 
        __get__(name){
            return eval(name);
        }
    };`;

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


        const exposed = {};
        let lastKey;
        for (let i = 0; i < vars.length; i++) {
            exposed[lastKey = vars[i]] = out.__get__(vars[i]);
        }
        deleteTempFile();

        return vars.length > 1 ? exposed : exposed[lastKey];
    }
}