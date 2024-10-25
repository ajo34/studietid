const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const express = require('express')
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

// Middleware for å parse innkommende forespørsler
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(__dirname, 'public')

// Konfigurere session
app.use(session({
    secret: 'hemmelig_nøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Sett til true hvis du bruker HTTPS
    
}));

//linking to login page
/*app.get('/loginp', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
})*/

//linking to admin page
app.get('/admin/*', checkLoggedIn, isAdminById, (req, res) => {
    res.sendFile(path.join(staticPath, '/admin/index.html'))
})

//linking to student page
app.get('/student/*', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(staticPath, '/student/index.html'));
})










// Middleware to check if the user is logged in
function checkLoggedIn(req, res, next) {
    
    if (req.session.loggedIn) {
        console.log('er Bruker logget inn?:', req.session.loggedIn);
        console.log('Bruker logget inn:', req.session.userId);
        return next();
    } else {
        res.redirect('/index.html');
    }
}




function isAdminById(req, res, next){
    let sql = db.prepare('SELECT isAdmin FROM user WHERE id = ?');
    console.log('denne', req.session.userId)
    let rows = sql.all(req.session.userId)
    console.log(rows[0].isAdmin + " isAdmin?")
    if (rows[0].isAdmin) {
        return next();
        
    } else {
        return res.redirect('/student');
    }
    
}


// Rute for innlogging
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Finn brukeren basert på id/email
    const user = getUser(emailExists(email).id)//hent bruker fra databasen basert på brukernavn
    console.log(user)
    console.log(user.password)
    console.log(user.email)
    
    //tidlig sjekk om passord er fylt inn
    if (!user) {
        return res.status(401).send('Ugyldig brukernavn eller passord');
    }
    
    // Sjekk om passordet samsvarer med hash'en i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (isMatch) {
        // Lagre innloggingsstatus i session 
        req.session.loggedIn = true;
        console.log(req.session.loggedIn + "logged in");
        req.session.userId = user.userid;
        console.log(user.userid + "uderiD");
        
        console.log(user.isAdmin)
        if (user.isAdmin) {
            return res.redirect('/admin');
        } else {
            return res.redirect('/student');
        }
        return res.send('Innlogging vellykket!');
    } else {
        return res.status(401).send('Ugyldig brukernavn eller passord');
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


function getUser(id) {
    console.log(id)
    let sql = db.prepare('SELECT user.id as userid, firstname, lastname, email, password, isAdmin, role.name  as role FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
    let rows = sql.all(id)
    console.log(rows[0])
    
    return rows[0]
}


app.get('/getusers/', (req, res) =>{
    let sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, role.name as role 
        FROM user inner join role on user.idrole = role.id `);
    let users = sql.all()
    
    
    res.send(users)
    
})

app.get('/getactivities/', (req, res) =>{
    let sql = db.prepare(`
        SELECT activity.id as idActivity, idUser, startTime, subject.name as subject, room.name as room, status.name as status, duration
        from activity inner join subject on activity.idsubject = subject.id, room on activity.idroom = room.id, status on activity.idstatus = status.id`)
    let activities = sql.all()
    
    
    res.send(activities)
    
})

function addUser(firstName, lastName, idRole, isAdmin, email, password){
    
    
    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email, password)  
                        values (?, ?, ?, ?, ?, ?)`)
    const info = sql.run(firstName, lastName, idRole, isAdmin, email, password)

    
    sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, password, role.name as role 
        FROM user inner join role on user.idrole = role.id WHERE user.id  = ?`);
    
    
    let rows = sql.all(info.lastInsertRowid)
    console.log("row inserted",rows[0])
    
    return rows[0]
    
}

function checkValidEmail(email) {
    let re = RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    if (!re.test(email)) {
        return true
    } else {return false}

}

function emailExists(email) {
    let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
    const info = sql.get(email)
    console.log('infolop:', info)
    return info
}


app.post('/adduser', async (req, res) => {
    
    const { firstName, lastName, idRole, isAdmin, newEmail, newPassword } = req.body;

    
    if (checkValidEmail(newEmail)) {
        return res.json({ error: 'Email invalid' }); 
    }
    if (emailExists(newEmail)) {
        res.redirect(`/index.html?errorMsg=EmailExists.`)
        return res('Email already exists')
        //return res.json({ error: 'Email already exists' });
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    // Insert new user 
    
    const newUser = addUser(firstName, lastName, 2, 0, newEmail, hashedPassword);
    
    if (!newUser) { 
        console.log({ error: 'Failed to register user.' }); 
        return res.json({ error: 'Failed to register user.' });
        
    }
    console.log({ message: 'User registered successfully!', user: newUser }); 

    res.sendFile(path.join(staticPath, 'index.html'))
});


function deleteUser(email){

    let sql = db.prepare(`
    SELECT user.id as userid, firstname, lastname, email
    FROM user WHERE email  = ?`);
    
    sql = db.prepare(`DELETE FROM user WHERE email = ?`);
    const info = sql.run(email)

    
}

app.post('/removeuser', (req, res) => {
    const { firstName, lastName, idRole, isAdmin, email } = req.body
    console.log("id", email)

    deleteUser(email);
    res.sendFile(path.join(staticPath, 'index.html'))
})





function getFormattedDate() {
    const date = new Date().toLocaleString('sv-SE', {timeZone: 'Europe/Oslo'});
    const formattedDate = date.toString().replace('T', ' ').slice(0, 19);
    return formattedDate;
}

function regActivity(idUser, startTime, idSubject, idRoom, idStatus, duration){
    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration)
                        values (?, ?, ?, ?, ?, ?)`)
    const info = sql.run(idUser, startTime, idSubject, idRoom, idStatus, duration)
    console.log(info)

}

app.post('/regactivity', (req, res) => {
    const { idUser, startTime, idSubject, idRoom, idStatus } = req.body
    console.log('test')
    regActivity(req.session.userId, getFormattedDate(), Number(idSubject), Number(idRoom), 2, 60)
    res.redirect('/student')
    
})


function updateActivity(  idTeacher, idStatus, idActivity){
    
    let sql = db.prepare(`UPDATE activity set idTeacher = ?, idStatus = ? WHERE id = ?`)
    const info = sql.run(idTeacher, idStatus, idActivity)
    console.log(info)
    if (info.changes !== 0) {
        return 0
    } else {
        return { error: 'Failed to confirm activity.' }
    }
}

app.post('/updateactivity', (req, res) => {
    const {idTeacher, idStatus, idActivity} = req.body
    updateActivity(idTeacher, idStatus, idActivity)
    return res.send('Activity updated')
})


app.get('/getsubjectroom/', (req, res) =>{
    let sql = db.prepare(`
        SELECT subject.name as subject, subject.id as idSubject, room.id as idRoom, room.name as room
        FROM subject inner join room on subject.id = room.id `);
    let thingies = sql.all()
    
    
    res.send(thingies)
    
})


app.post('/removeactivity/', (req, res) => {
    console.log(req.body)
    const { idActivity } = req.body
    console.log("idDeletedActivity", idActivity)
    deleteActivity(idActivity);
    return res.redirect('/admin');
})
function deleteActivity(idActivity){
    let sql = db.prepare(`DELETE FROM activity WHERE id = ?`);
    const info = sql.run(idActivity)
    console.log(info)
    
}

app.get('/getuserdetails/', (req, res) => {
    //console.log(getUserDetails(req.session.userId)[0]);
    let sql = db.prepare(`SELECT user.id as userid, firstname, lastname, email FROM user WHERE userid = ?`)
    res.send(sql.all(req.session.userId)[0])
})
function getUserDetails(id){
    
}
app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})