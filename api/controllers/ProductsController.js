'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')

module.exports = {
    get: (req, res) => {
        let sql = 'SELECT GROUP_CONCAT( c.color ) as color ' +
                ',p.title,p.price,p.imagePath,p.description,p.id ' +
                'FROM products p join mst_productcolor c on p.id = c.productID ' +
                'group by p.id'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        let sql = 'SELECT GROUP_CONCAT( v.size ORDER BY v.size) as sizes ,c.color,p.title,p.price, ' +
                'p.imagePath,p.description ,GROUP_CONCAT( v.id ORDER BY v.size) as id FROM products p ' +
                'join mst_productcolor c on p.id = c.productID join variant v ' +
                'on v.productcolor = c.id where p.id = ? group by p.id, c.id'    
        //let sql = 'SELECT * FROM products WHERE id = ?'
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json(response)
        })
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