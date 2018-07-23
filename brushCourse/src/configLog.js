/*
 * @Author: ytj 
 * @Date: 2018-07-23 22:03:03 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-23 23:34:14
 */

"use strict";

const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: {
        logFile: {
            type: 'file',
            filename: path.resolve(__dirname, '../logs/normal.log'),
            maxLogSize: 10 * 1024 * 1024,
            encoding: 'utf-8',
        },
        errorFile: {
            type: 'file',
            filename: path.resolve(__dirname, '../logs/error.log'),
            maxLogSize: 10 * 1024 * 1024,
            encoding: 'utf-8',
        },
        out: {
            type: 'stdout'
        },
        completedW2f: {
            type: 'file',
            filename: path.resolve(__dirname, '../logs/completed.log'),
            maxLogSize: 10 * 1024 * 1024,
            encoding: 'utf-8',
        }
    },
    categories: {
        print: {
            appenders: ['out'],
            level: 'trace'
        },
        normalLog: {
            appenders: ['out', 'logFile'],
            level: 'trace'
        },
        errorLog: {
            appenders: ['out', 'errorFile'],
            level: 'trace'
        },
        completedCourse: {
            appenders: ['completedW2f'],
            level: 'trace'
        },
        default: {
            appenders: ['out'],
            level: 'trace'
        }
    }
});

if (require.main === module) {
    const fs = require('mz/fs');
    Promise.resolve(fs.writeFile(path.resolve(__dirname, '../logs/normal.log'), '', {encoding: 'utf-8'}));
    Promise.resolve(fs.writeFile(path.resolve(__dirname, '../logs/error.log'), '', {encoding: 'utf-8'}));
    // const l2f = log4js.getLogger('normalLog');
    // l2f.info('123');
} else {
    module.exports = log4js;
}