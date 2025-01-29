// Porpuse: Main file for the application

// Modules
import * as sql from './modules/sql.js';

import { checkLoggedIn, isAdminById} from './modules/middleware.js';

// Node imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import {
    SERVER_ROOT_URI,
    GOOGLE_CLIENT_ID,
    JWT_SECRET,
    GOOGLE_CLIENT_SECRET,
    COOKIE_NAME,
    UI_ROOT_URI,
} from "./config.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google"
  },
  function(accessToken, refreshToken, profile, cb) {
    /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });*/
    console.log(profile)
    return cb(null, profile);
  }
));





app.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));
  
  app.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/student');
    });




configDotenv();
const SECRET = process.env.SECRET;

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

const staticPath = path.join(__dirname, 'public');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));







//linking to login page
app.get('/', (req, res) => {
    res.redirect('/login/');
})

//linking to admin page
app.get('/admin/*', checkLoggedIn, isAdminById, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/'))
})

//linking to student page
app.get('/student/*', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/'));
})

app.get('/tos/*', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/tos/'));
})





// Rute for innlogging
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    

    //tidlig sjekk om emailen  eksisterer
    let user = sql.emailExists(email)
    
    if (!user) {
        return res.redirect(`/login/index.html?errorMsg=UgyldigEmail.`)
    }

    // Finn brukeren basert på id/email
    user = sql.getUser(sql.emailExists(email).id)
    
    // Sjekk om passordet samsvarer med hash'en i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
        // Lagre innloggingsstatus i session 
        req.session.loggedIn = true;
        req.session.role = user.role;
        req.session.userId = user.userid;
        
        
        if (user.isAdmin) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/student');
        }
        
    } else {
        return res.redirect(`/login/index.html?errorMsg=WrongPassword.`)
    }
});

// Beskyttet rute som krever at brukeren er innlogget
app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        res.send(`Velkommen, ${req.session.username}!`);
    } else {
        res.status(403).send('Du må være logget inn for å se denne siden.');
    }
});





app.get('/getusers/', checkLoggedIn, (req, res) =>{
    
    res.send(sql.getUsers())
    
})

app.get('/getactivities/', checkLoggedIn, (req, res) =>{
    res.send(sql.getActivities(req.session.userId))
    
})
app.get('/getallactivities/', checkLoggedIn, (req, res) =>{
    
    
    res.send(sql.getAllActivities())
    
})




app.post('/adduser', async (req, res) => {
    
    const { firstName, lastName, idRole, isAdmin, newEmail, newPassword } = req.body;

    
    if (sql.checkValidEmail(newEmail)) {
        return res.redirect(`/login/index.html?errorMsg=EmailInvalid.`); 
    }
    if (sql.emailExists(newEmail)) {
        return res.redirect(`/login/index.html?errorMsg=EmailExists.`)
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    // Insert new user 
    
    const newUser = sql.addUser(firstName, lastName, 2, 0, newEmail, hashedPassword);
    
    if (!newUser) { 
        console.log({ error: 'Failed to register user.' }); 
        return res.redirect(`/login/index.html?errorMsg=fail.`)
        
    }
    console.log({ message: 'User registered successfully!', user: newUser }); 

    res.redirect('/login')
});




app.post('/removeuser',  checkLoggedIn, isAdminById, (req, res) => {
    const { firstName, lastName, idRole, isAdmin, email } = req.body
    console.log("id", email)

    sql.deleteUser(email);
    res.sendFile(path.join(staticPath, 'index.html'))
})




app.post('/regactivity', checkLoggedIn, (req, res) => {
    const { idUser, startTime, idSubject, idRoom, idStatus } = req.body
    console.log('test')
    sql.regActivity(req.session.userId, sql.getFormattedDate(), Number(idSubject), Number(idRoom), 2, 60)
    res.redirect('/student')
    
})




app.post('/updateactivity', checkLoggedIn, isAdminById, (req, res) => {
    const {idTeacher, idStatus, idActivity} = req.body
    sql.updateActivity(req.session.userId, idStatus, idActivity)
    return res.send('Activity updated')
})


app.get('/getroom/', checkLoggedIn, (req, res) =>{

    res.send(sql.getRoom())
    
})

app.get('/getsubject/', checkLoggedIn, (req, res) =>{

    res.send(sql.getSubject())
    
})


app.post('/removeactivity/', checkLoggedIn, isAdminById, (req, res) => {
    console.log(req.body)
    const { idActivity } = req.body
    console.log("idDeletedActivity", idActivity)
    sql.deleteActivity(idActivity);
    return res.redirect('/admin');
})

app.get('/getuserdetails/', checkLoggedIn, (req, res) => {
    console.log(sql.getUserDetails(req.session.userId)[0]);
    res.send(sql.getUserDetails(req.session.userId))
})



//GET https://admin.googleapis.com/admin/directory/v1/users/{userKey}






app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})


