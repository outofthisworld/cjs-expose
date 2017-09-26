"use strict"

const fs = require('fs');
const path = require('path');
const { Module } = require('module');


function compile(code, filename, opts) {
    if (typeof filename === 'object') {
        opts = filename;
        filename = undefined;
    }

    opts = opts || {};
    filename = filename || '';

    opts.appendPaths = opts.appendPaths || [];
    opts.prependPaths = opts.prependPaths || [];

    if (typeof code !== 'string') {
        throw new Error('code must be a string, not ' + typeof code);
    }

    var paths = Module._nodeModulePaths(path.dirname(filename));

    var parent = module.parent;
    var m = new Module(filename, parent);
    m.filename = filename;
    m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
    m._compile(code, filename);

    var exports = m.exports;
    parent.children && parent.children.splice(parent.children.indexOf(m), 1);

    return exports;
};

module.exports = function expose(modulePath, encoding = 'utf8') {
    if (!modulePath) {
        throw new Error('Path must be supplied to expose');
    }

    return function(vars) {
        if (!Array.isArray(vars) && typeof vars !== 'string') {
            throw new Error('Invalid data type passed to expose');
        }

        vars = typeof vars === 'string' ? [vars] : vars;
        const wrapScript = function(script) {
            return script += `\r\nmodule.exports = { 
                    __get__(name){

                        return eval(name);
                    }
                 };`;
        }

        let out = compile(wrapScript(fs.readFileSync(modulePath, encoding)), path.basename(modulePath));


        const exposed = {};
        let lastKey;
        vars.forEach(function(v, i) {
            try {
                exposed[lastKey = v] = out.__get__(v);
            } catch (err) {
                exposed[lastKey = v] = undefined;
            }
        })

        return vars.length > 1 ? exposed : exposed[lastKey];
    }
}