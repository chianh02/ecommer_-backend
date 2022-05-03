const express = require('express')
var path = require('path');
const app = express()
var cors = require('cors')

// cho phep tat cac cac domain khac goi toi cross
app.use(cors())
//body-parser để trích xuất toàn bộ phần nội dung của request đến và hiển thị nó trên đó req.body
const bodyParser = require('body-parser')
//load dotenv để sử dụng environment variables
//require('dotenv').load()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//set static dir, pbulic thong tin tu day
app.use(express.static(path.join(__dirname, 'public')));


//import file routes để load tất cả routes đã được khai báo trong file
let routes = require('./api/routes') //importing route
routes(app)
//thêm middleware để check nếu request API không tồn tại Dễ hiểu phải không nào??
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)