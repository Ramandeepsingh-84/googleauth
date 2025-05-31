const express = require('express');
const session = require("express-session");
require('./auth');
const passport = require('passport');
require('dotenv').config();
const connectToDB = require('./db');
connectToDB();
function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({
    name: 'mycustomcookie',
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000  // 1 minute in milliseconds
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render('auth',{message:null})
    // res.send('<a href="/auth/google">Authenticate with Google</a>');
})
// app.get('/', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render('home', { user: req.user });
//   } else {
//     res.redirect('/auth/google');
//   }
// });


app.get('/auth/google',
    passport.authenticate('google',
         {scope: ['email', 'profile'],
            prompt: 'select_account'
         },
        )
)

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect: '/protected',
        failureRedirect:'/auth/failure'
    })
)

app.get('/auth/failure', (req,res)=>{
    res.send('something went wrong...');
})
app.get('/protected', isLoggedIn, (req,res)=>{
    console.log(req.user);
    res.render('home', {user: req.user});
    // res.send(`hello ${req.user.displayName}`)
})

// app.get('/logout', (req,res)=>{
//     req.logout();
//     req.session.destroy();
//     res.send('logout successfully');
// })


app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }

        // Destroy session on server
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            }

            // Clear cookie from browser
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: false, // set to true if you're using HTTPS
                sameSite: 'lax'
            });

            res.redirect('/');
    //   res.render('auth', { message: "Logout successfully" }); // ✅
        });
    });
});



app.listen(5000, ()=>{
    console.log('server running 5000')
})