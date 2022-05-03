'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('../db')

module.exports = {
    get: (req, res,next) => {
        let { productId } = req.query
        console.log("variat: " + productId)
        if (productId) {
            let sql = "SELECT v.productId, v.color, group_concat(v.size ORDER BY v.size) AS size," + 
                        "group_concat(v.id order by v.size) as id, v.imagePath FROM variant v WHERE v.productID = ? " +
                        "GROUP BY v.color";
            //let sql = 'SELECT * FROM variant WHERE productID = ?'
            db.query(sql, [productId],(err, response) => {
                if (err) throw err
                console.log(response)
                res.json(response)
            })
        } else {
            let sql = 'SELECT * FROM variant'
            db.query(sql, (err, response) => {
                if (err) throw err
                res.json(response)
            })
        }
        
    },
    update: (req, res) => {
        let data = req.body;
        let productId = req.params.productId;
        let sql = 'UPDATE products SET ? WHERE id = ?'
        db.query(sql, [data, productId], (err, response) => {
            if (err) throw err
            res.json({message: 'Update success!'})
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO products SET ?'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({message: 'Insert success!'})
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM products WHERE id = ?'
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json({message: 'Delete success!'})
        })
    }
}
