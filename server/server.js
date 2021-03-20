let express = require('express')
let mysql = require('mysql')
let bodyParser = require('body-parser')
let { v4: uuidv4 } = require('uuid')
let server = express()

server.listen(process.env.PORT || 3100, () => {
    console.log(uuidv4())
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


server.get("/", (req, res) => {
    res.send("yok")

    connection.connect(() => {
        // connection.query("INSERT INTO blog_comments VALUES('icha@gmail.com', 'one last time', 'taqwim@gmail.com', 'ini beneran gaksih')", (err, res) => {
        //     console.log(err)
        // })
        // connection.query("SELECT * FROM blog INNER JOIN blog_comments ON blog.email = blog_comments.email AND blog.title = blog_comments.article", (err, res) => {
        //     console.log(res)
        // })
    })

    // connection.connect(() => {
    //     console.log("yeybisa")
    //     connection.query("INSERT INTO blog VALUES ('', 'heh world!', 'tulus@gmail.com', '', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste sint animi deleniti eveniet similique tempore ad consequatur amet. Consequatur, consequuntur soluta. Doloremque inventore minus ea minima? Beatae magni ipsam dolorum')", (err, result) => {
    //         res.send(result)
    //     })
    // })
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
    res.redirect("http://localhost:3000")
})

server.get("/new", (req, res) => {
    console.log(req.body)
    //how to send many data with one res
    // res.send({
    //     email: req.body.email,
    //     pass: req.body.password
    // })
    res.redirect("http://localhost:3000")
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

server.post("/newcomment", (req, res) => {
    let fromwho = req.body.fromwho
    let comment = req.body.comment
    let author = req.body.author
    let route = req.body.route
    let data = [req.body.author, req.body.route, req.body.fromwho, req.body.comment]
    // res.redirect("http://localhost:3000/article/" + route)
    console.log(req.body)
    res.send("okdech")
    // connection.query("insert into blog_comments (email, article, from_who, comment) VALUES (?)", [data], (err, res) => {
    //     console.log(err, res)
    // })
})