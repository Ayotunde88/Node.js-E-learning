var express = require('express');
const app = express()
var bodyParser = require('body-parser');
const https = require('https');
var session = require('express-session');
var path = require('path');
var dotenv = require('dotenv');
var axios = require('axios');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var mysql = require('mysql');
const port = process.env.PORT || 4000
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use('/css',express.static(__dirname +'public/css'))
app.use('/image',express.static(__dirname +'public/img'))
app.use('/js',express.static(__dirname +'public/js'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret:"hu38002nbb2822dggdygdg",
    resave: false,
    saveUninitialized:true

}))
app.use(express.json())

var pool = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''

});
app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/register', (req,res)=>{
    res.render('authentication/register')
})
app.post('/register', (req,res)=>{
    if (req.body){
        details=req.body
        console.log(req.body.phonenumber)
        pool.query("SELECT * FROM accounts WHERE phonenumber= ? OR email=?", [req.body.phonenumber,req.body.email], (err, results) => {
            if(err){
                // res.write("Something Went Wrong Try Again")
                // res.end()
                console.log('Something Went Wrong Try Again')
            }
            else if(results.length > 0){
                res.write('You are already registered login to continue')
                res.end()
            }
            else{
                pool.query('INSERT INTO accounts (firstname,lastname,email,phonenumber,address) VALUES (?,?,?,?,?)',[req.body.firstname,req.body.lastname,req.body.email,req.body.phonenumber,req.body.address],(err,results)=>{
                    if (err){
                    console.log('Something Went Wrong Try Again')
                    }
                    else{
                        console.log('Registration Successful !')
                        res.write("Registration Successful !")
                        res.end()
                        let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // use SSL
                            auth: {
                            user: 'ayotundebalogun4@gmail.com',
                            pass: 'guupaoutzqtyqlrw'
                            }
                        });
                          // create the email message
                          let mailOptions = {
                            from: 'ayotundebalogun4@gmail.com',
                            to: details.email,
                            subject: 'Registration Success',
                            html: `<p>Hello, Thanks for your registration. Our Admin will contact you soon Please click the link to confirm your email:</p><a href="http://100.26.255.115/createpassword?setpassword=true&email="${details.email}>Confirm Email</a>`
                          };
                          
                          // send the email
                          transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(`Email sent: ${info.response}`);
                            }
                          });
                                  
                    }
                })
            }
        })

    }
    else{
        res.write("Something Went Wrong Try Again")
        res.end()
    }
    // res.render('authentication/register')
})
app.get('/createpassword', (req,res)=>{
    if (req.query.email){
        globalEmail = req.query.email
        res.render('authentication/createpassword')
    }
    else{

        res.render('authentication/register')
    }

})
app.post('/createpassword', (req,res)=>{
    if(req.body){
        passwordDetails = req.body
        var saltRounds = 10;
        bcrypt.hash(passwordDetails.Password, saltRounds, function(err, hash) {
            pool.query("UPDATE accounts SET password=? WHERE email=? ", [hash,globalEmail], (err, results, fields) => {
                if(err){
                    res.write("Error Occured")
                    res.end()
                    console.log('Error')
                }
                else{
                    res.write('Password Set Successful !')
                    res.end()
                }
            })
        });
    }
})
app.get('/dashboard/:email', (req,res)=>{
    if (req.params.email){
        pool.query("SELECT * FROM accounts WHERE  email=?", [req.params.email,req.params.email], (err, results) => {
            if(err){
                res.redirect('/login')
            }
            else if(results.length > 0){
                res.render('dashboard/chooseplan',{loggedIn:1,email:req.params.email})
            }
            else{
                res.redirect('/login')
            }
        })
      

    }
    else{
        res.redirect('/login')
    }
})
app.post('/dashboard/selectplan', (req,res)=>{
    if (req.body){
        planDetails = req.body
        pool.query("SELECT * FROM plans WHERE  email=? AND plan=?", [planDetails.Email,planDetails.selectPlan], (err, results) => {
            if(err){
                res.write("Something Went Wrong Try Again")
                res.end()
            }
            else if(results.length > 0){
                res.write(JSON.stringify({'plan':req.body.selectPlan, 'Email':req.body.Email}))
                res.end()
            }
            else{
                pool.query('INSERT INTO plans (plan,email) VALUES (?,?)',[planDetails.selectPlan,planDetails.Email],(err,results)=>{
                    if (err){
                    console.log('Something Went Wrong Try Again')
                    }
                    else{
                        res.write(JSON.stringify({'plan':req.body.selectPlan, 'Email':req.body.Email}))
                        res.end()
                    }
                })
            }
        })
      

    }
    else{
        res.redirect('/login')
    }
})
app.post('/plantransaction', (req,res)=>{
    planDetails = req.body
    const params = {
        "email": planDetails.email,
        "amount": planDetails.amount
    }
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        channels:["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer", "eft"],
        callback_url:`http://100.26.255.115/dashboard/${planDetails.email}`,
        method: 'POST',
        headers: {
            Authorization: 'Bearer sk_test_400c560ff2c2322d29d6d527cef8284f87552368',
            'Content-Type': 'application/json'
        }
    }
    
    const request = https.request(options, response => {
        response.on('data', data => {
            // console.log(JSON.parse(data));
            res.json(JSON.parse(data));
        });
    });
    
    request.on('error', error => {
        console.error(error);
    });
    
    request.write(JSON.stringify(params));
    request.end();
})
app.get('/login', (req,res)=>{
    res.render('authentication/login')
})
app.post('/login', (req,res)=>{
    if(req.body){
        passwordDetails = req.body
        console.log(passwordDetails.Email)
        pool.query("SELECT * FROM accounts WHERE phonenumber= ? OR email=?", [passwordDetails.Email,passwordDetails.Email], (err, results) => {
            if(err){
                res.write("Something Went Wrong Try Again")
                res.end()
            }
            else if(results.length > 0){
                password = results[0].password
                email = results[0].email
                console.log(password)
                bcrypt.compare(passwordDetails.Password, password, function(err, result) {
                    if(result==true) {
                        // req.session.email = email;
                        res.write(`${email}`)
                        res.end()
                    } 
                    else{
                        res.write('Password is inccorect')
                        res.end()
                    }
                });
            }
            else{
                res.write('This User does not exist')
                res.end()
            }
        })
        

    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


