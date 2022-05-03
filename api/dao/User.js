
const util = require('util')
const mysql = require('mysql')
const db = require('../db')
var bcrypt = require('bcryptjs');

module.exports.createUser = async function (fullname,email,password, callback) {
    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(password, salt, function (err, hash) {
    //         password1 = hash;
    //     });
    // });
    //TODO tach ra mot ham goi ko dong bo 2 lan
    const password1 = await new Promise((success, failure) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if(err) {
                    failure(err);
                } else {
                    success(hash);
                }
            });
        });
      })
    console.log('test: '+ password1);
    var values = [
        // phai giong voi ten truong trong db
        [email, password1,fullname],
      ];
    console.log("Connected!");
    var sql = "INSERT INTO users (username, password,fullname) VALUES ?";
    db.query(sql,  [values],function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        return callback(err,result);
    });
}

module.exports.getUserByEmail = function (email, callback) {
    let sql = 'SELECT * FROM users WHERE username = ?'
    db.query(sql, [email], (err, response) => {
        if (err) throw err
        return callback(err,response);
    })
    
    //User.findOne(query, callback);
}


module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        return callback(null, isMatch);
    });
}

module.exports.getAllUsers = function (callback) {
    User.find(callback)
}