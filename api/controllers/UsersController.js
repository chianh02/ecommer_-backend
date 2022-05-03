'use strict'
const jwt = require('jsonwebtoken')
let User = require('../dao/User');
let Cart = require('../dao/Cart');
let Product = require('../dao/Products');
let Variant = require('../dao/Variants');
const config = require('../configs/jwt-config')
const CartClass = require('../modules/Cart')

module.exports = {
    get: (req, res,next) => {
        const { email, password } = req.body.credential || {}
        if (!email || !password) {
            let err = new TypedError('login error', 400, 'missing_field', { message: "missing username or password" })
            return next(err)
        }
        
        User.getUserByEmail(email, function (err, user) {
            if (err) return next(err)
            if (!user) {
                let err = new TypedError('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
                return next(err)
            }
            User.comparePassword(password, user[0].password, function (err, isMatch) {
                if (err) return next(err)
                if (isMatch) {
                    let token = jwt.sign({ email: email },config.secret,{ expiresIn: '7d' })
                    res.status(201).json({
                        user_token: {
                        user_id: user[0].id,
                        user_name: user[0].fullname,
                        token: token,
                        expire_in: '7d'
                        }
                    })
                } else {
                    let err = new TypedError('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
                    return next(err)
                }
            })
        })
    },

    signin: (req, res,next) => {
        const { fullname, email, password, verifyPassword } = req.body
        if(password!==verifyPassword){
            return next("password ko giong nhau")
        }
        // check mail da co chua
        User.getUserByEmail(email, function (error, user) {
            if (error) return next(error)
            if (0 < user.length) {
                // TODO
                // xu lý báo rằng địa chỉ mail này đã được sử dụng
                //let err = new TypedError('signin error', 409, 'invalid_field', {
                //    message: "user is existed"
                //})
                return next(error)
            }
            console.log("check xong");
            // luu vao db
            User.createUser(fullname,email,password, function (err, user) {
                if (err) return next(err);
                return res.json({ message: 'user created' })
            })
        })
    },
    cartsInsert:(req, res,next) => {
        let userId = req.params.userId
        let { variantId } = req.body
        console.log("vao day");
        // neu ko co sp nao thi bao loi
        if( !variantId || !userId) {
            let err = new TypedError('/cart', 400, 'invalid_field', {
            message: "invalid request body"
            })
            return next(err)
        }

        Cart.getCartByUserId(userId, function (err, c) {
            if (err) return next(err)
            // user nay khong có data nào thi insert một dòng mới vào với totalQty, totalPrice là null
            if (!c.length) {
                return Cart.createCart(0,0,userId, variantId, function (err, resultCart) {
                    if (err) return next(err)
                    return res.status(201).json({ cart: resultCart })
                })
            }
            // neu user nay co thi check xem co productid, variant co chua
            // chua co thi tao moi, co roi thi tang len 1
            Cart.findByVarId(variantId,function (e, product) {
                if (e) {
                    e.status = 406;
                    return next(e);
                }
                // neu chua co thi tao mot dong moi
                if (!product.length) {
                    return Cart.createCart(0,0,userId, variantId, function (err, resultCart) {
                        if (err) return next(err)
                        return res.status(201).json({ cart: resultCart })
                    })
                } else {
                    // Update tang so luong san pham do len 1
                    return Cart.UpdateCartByVarId(variantId,product[0].totalQty,product[0].totalPrice,function (e, resultCart) {
                        if (err) return next(err)
                        return res.status(201).json({ cart: resultCart })
                    })
                }
            })
        })
    },
    cartsdetail:(req, res,next) => {
        let userId = req.params.userId
        Cart.getCartByUserId(userId, function (err, cart) {
            if (err) return next(err)
            if (cart.length < 1) {
            let err = new TypedError('cart error', 404, 'not_found', { message: "create a cart first" })
            return next(err)
            }
            return res.json({ cart: cart })
        })
    },
    getcartsdetail:(req, res,next) => {
        let userId = req.params.userId
        Cart.getCartDetailByUserId(userId, function (err, cartdetail) {
            if (err) return next(err)
            if (cartdetail.length < 1) {
                let err = new TypedError('cart error', 404, 'not_found', { message: "create a cart first" })
                return next(err)
            }
            return res.json({ cartdetail: cartdetail })
        })
    },
    cartcheckoutdetail:(req, res,next)=>{
        let userId = req.params.userId
        Cart.getCartCheckoutByUserId(userId, function (err, cartcheckout) {
            if (err) return next(err)
            if (cartcheckout.length < 1) {
            let err = new TypedError('cart error', 404, 'not_found', { message: "create a cart first" })
                return next(err)
            }
            console.log(cartcheckout);
            return res.json({ cartcheckout: cartcheckout })
        })
    },
    cartupdate:(req, res,next)=>{
        let userId = req.params.userId
        let { arryProduct } = req.body
        
        //up date trong loop
        arryProduct.forEach(element => {
            console.log(element.totalQty);
            Cart.updateCart(element,userId, function (err, resultCart) {
                if (err) return next(err)
                //res.status(201).json({ cart: resultCart })
            })
        });
        return res.status(201).json({ updateresults: true })
    },
    returnjson:(req, res,next) => {
        let jsonData = require('./db.json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(jsonData));
        res.end();
        return res;
    }
        
}
