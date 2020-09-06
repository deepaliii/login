const express = require("express")
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

var session = require('express-session');


//const passport=require("passport");
var mysql = require("mysql")
const app = express();
const port = process.env.PORT || 4000;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.urlencoded({ "extended": "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json


app.listen(port, () => {
    console.log(`magic happening at post ${port}`);
})


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newdb'
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});
app.get('/', (req, res) => {
    res.sendFile("./index.html")
})

app.get("/dashboard",(req,res)=>{
     res.sendFile(__dirname+"/public/dashboard.html")  
})
app.get("/signup",(req,res)=>{
    res.sendFile(__dirname+"/public/signup.html")
})

app.get("/update",(req,res)=>{
    res.sendFile(__dirname+"/public/update.html")
})

app.post("/updateprofile",(req,res)=>{
    
    console.log(req.body)
    console.log(req.session)
    let sql="update employee set name='"+req.body.name+"' and email='"+req.body.email+"' where email='"+req.session.email+"'"
    conn.query(sql,(err,results)=>{

        console.log(results)
        if(err){
            res.json({
                "message":"ERROR"
            })
        }
        else{
            res.json({
                "messasge":"SUCCESS",
                "data":results
            })
        }
    });
});

app.post("/signin", (req, res) => {

    conn.query("Insert into employee (name,email,password) VALUES ('" + req.body.name + "','" + req.body.email + "','" + req.body.password + "')", function (err, result) {
        if (err)
            throw err;
    });


    res.redirect('/dashboard')
});

app.get('/getUserDetails',(req,res)=>{

    console.log(req.session.email)
    conn.query("select * from employee where email='"+req.session.email+"'",(err,results)=>{
        if(err){
            res.json({
               "Message":"INTERNAL SERVER ERROR"
            })
        }
        else{
             res.json(results)
        }
        res.end();
    })
})

app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
        conn.query("SELECT * FROM employee WHERE email = '"+email+"' AND password = '"+password+"'", function (error, results, fields) {
            // if(results.length==0){
            //     res.redirect('/')
            // }
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/dashboard');
            } else {
                res.send({
                    "message":"CREDENTIALS NOT CORRECT"
                })
            }
            res.end()

        });
    }

});

app.get('/dashboard', function (req, res) {
    if (req.session.loggedin) {
        res.send('Welcome, ' + req.session.email + '!');// yha pe ham name kaise display karaye joki hamne sign in time dala
    }
    res.end();
});

app.post('/logout',(req,res)=>{
      req.session.destroy();
      res.redirect('/');
});