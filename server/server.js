let express = require('express')
let mysql = require('mysql')
let bcrypt = require('bcryptjs')
let bodyParser = require('body-parser')
let { v4: uuidv4 } = require('uuid')
let server = express()

server.listen(process.env.PORT || 3100, () => {
    console.log(uuidv4())
    let pass = 'Jayasutiabadi01'
    let hash = bcrypt.hashSync(pass, bcrypt.genSaltSync())
    console.log('ini hasilnya: ' + hash)
})

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next()
})
server.use(bodyParser.urlencoded({ extended: true }))

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'latihan'
})

//pass: hahaha

server.post('/updateblog', (req, result) => {
    console.log(req.body)
    connection.query(`UPDATE blog SET title = '${req.body.title}', body = '${req.body.body}' WHERE id = '${req.body.id}'`, (err, res) => {
        if (err) {
            result.send({ message: 'Failed to update. Error: ' + err })
        }
        else {
            result.redirect('/admin')
        }
    })
})

server.post('/newuser/:email/:nickname/:pass', (req, res) => {
    let hashedPass = bcrypt.hashSync(req.params.pass, bcrypt.genSaltSync())
    let data = [uuidv4(), hashedPass, req.params.email, req.params.nickname]

    connection.query(`INSERT INTO blog_users (id, password, email, nickname) VALUES (?)`, [data], (err, result) => {
        if (err) {
            res.send({ message: 'failed' })
        }
        else {
            res.send({ message: 'success' })
        }
    })
})

server.post('/login/:email/:pass', (req, res) => {
    connection.query(`select * from blog_users where email = '${req.params.email}'`, (err, result) => {
        if (err) {
            res.send({ message: 'failed' })
        }
        else {
            if (bcrypt.compareSync(req.params.pass, result[0].password) == false) {
                res.send({ message: 'failed' })
            }
            else {
                res.send({ message: 'success' })
            }
        }
    })
})

server.post("/new", (req, res) => {
    // res.send("ok")
    //how to send many data with one res

    let title = req.body.title
    let email = req.body.email
    let date = req.body.date
    let body = req.body.body
    let id = req.body.id
    console.log(id)

    connection.connect(() => {
        console.log("yeybisa")
        connection.query(`INSERT INTO blog VALUES ('${uuidv4()}', '${title}', '${email}', '${date}', '${body}')`, (err, result) => {
            if (err) {
                console.log(err)
            }
        })
    })
    res.redirect("")
})

server.get("/new", (req, res) => {
    console.log(req.body)
    //how to send many data with one res
    // res.send({
    //     email: req.body.email,
    //     pass: req.body.password
    // })
    res.redirect("")
})

server.get("/data", (req, res) => {
    connection.query("select * from blog", (err, result) => {
        res.send(result)
    })
})

server.get("/article", (req, res) => {
    connection.query(`select * from blog INNER JOIN blog_comments ON blog.title = blog_comments.article`, (err, result) => {
        res.send(result)
    })
})

// server.post('/deleteksong', (req, res) => {
//     connection.query('DELETE FROM blog WHERE body = ""', (err, res) => {
//         console.log(err)
//         console.log(res)
//     })
// })

server.post("/newcomment", (req, res) => {
    let fromwho = req.body.fromwho
    let comment = req.body.comment
    let author = req.body.author
    let route = req.body.route
    let data = [req.body.author, req.body.route, req.body.fromwho, req.body.comment]
    res.redirect("/article/" + route)
    // console.log(req.body)
    // res.send("okdech")
    connection.query("insert into blog_comments (email, article, from_who, comment) VALUES (?)", [data], (err, res) => {
        console.log(err, res)
    })
})

server.post('/:id/deletepost', (req, res) => {
    console.log("ini id nya nii " + req.params.id)
    connection.query(`DELETE FROM blog WHERE id = '${req.params.id}'`, (err, res) => {
        console.log(err)
        if (err) {
            res.send({ message: 'Failed to delete post' })
        }
        else {
            res.redirect("/admin")
        }
    })
})