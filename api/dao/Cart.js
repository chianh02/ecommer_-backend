const util = require('util')
const mysql = require('mysql')
const db = require('../db')

module.exports.getCartByUserId = function (userId, callback) {
    let sql = 'SELECT * FROM cart WHERE userId = ?'
    db.query(sql, [userId], (err, response) => {
        if (err) throw err
        // thu ko return => ra bug do no ko trả về mà chạy tiếp
        return callback(err,response);
    })
    //return callback(err,response);
}
module.exports.getCartDetailByUserId = function (userId, callback) {
    let sql = 'SELECT c.totalQty, v.size, p.title, p.imagePath, c.totalQty, p.price, c.variantsId ' +
              ', c.id as cartid,color.color, p.id as productid FROM cart c join variant v on v.id = c.variantsId ' +
              'join mst_productcolor color on v.productcolor = color.id join products p ' +
              'on p.id = color.productID WHERE userId = ? order by p.id';
    db.query(sql, [userId], (err, response) => {
        if (err) throw err
        return callback(err,response);
    })
    //return callback(err,response);
}
module.exports.getCartCheckoutByUserId = function(userId, callback){
    let sql = 'SELECT GROUP_CONCAT( v.size ) as sizes, SUM(c.totalQty) as quantity ' +
            ',color.color as color, GROUP_CONCAT( c.variantsId ) as cartid ' +
            ',p.title, p.price ,p.imagePath FROM cart c join variant v on v.id = c.variantsId ' +
            'join mst_productcolor color on color.id = v.productcolor ' +
            'join products p on p.id = color.productID WHERE c.userId = ? and c.totalQty > 0 ' +
            'group by p.id, color.color';    
    db.query(sql, [userId], (err, response) => {
        if (err) throw err
        return callback(err,response);
    })

}
module.exports.createCart = function (totalQty, totalPrice,userId,variantId, callback) {
    var values = [
        // phai giong voi ten truong trong db
        [totalQty, totalPrice,userId,variantId],
      ];
    
    //var sql = "INSERT INTO cart (totalQty, totalPrice,userId,productId,variantsId) VALUES ?";
    var sql = "INSERT INTO cart (totalQty, totalPrice,userId,variantsId) VALUES ?";
    db.query(sql,  [values],function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        return callback(err,result);
    });
}
module.exports.findByVarId = function (varsId, callback) {
    let sql = 'SELECT * FROM cart WHERE variantsId = ?'
    db.query(sql, [varsId], (err, response) => {
        if (err) throw err
        // thu ko return
        return callback(err,response);
    })
    //return callback(err,response);
}
module.exports.UpdateCartByVarId= function (varsId,totalQty,totalPrice,callback) {
    let sql = 'Update cart SET totalQty = ?, totalPrice = ? WHERE variantsId = ?'
    db.query(sql, [totalQty +1,totalPrice,varsId], (err, response) => {
        if (err) throw err
        // thu ko return
        return callback(err,response);
    })
}
module.exports.updateCart = function (product,userId, callback) {
    
    var sql = "UPDATE cart SET totalQty = ? WHERE id = ?";
    db.query(sql,  [product.totalQty ,product.cartid],function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        return callback(err,result);
    });
}