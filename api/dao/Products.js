const util = require('util')
const mysql = require('mysql')
const db = require('../db')

module.exports.findById = function (proId, callback) {
    let sql = 'SELECT * FROM products WHERE id = ?'
    db.query(sql, [proId], (err, response) => {
        if (err) throw err
        // thu ko return
        return callback(err,response);
    })
    //return callback(err,response);
}