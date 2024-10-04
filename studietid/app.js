const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const staticPath = path.join(__dirname, 'public')


app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
})
app.get('/admin', (req, res) => {
    res.sendFile(path.join(staticPath, '/admin/'))
})

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

function addUser(firstName, lastName, idRole, isAdmin, email){
    
    
    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email)  
                        values (?, ?, ?, ?, ?)`)
    const info = sql.run(firstName, lastName, idRole, isAdmin, email)

    
    sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, role.name as role 
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


app.post('/adduser', (req, res) => {
    
    const { firstName, lastName, idRole, isAdmin, email } = req.body;
    if (checkValidEmail(email)) {
        return res.json({ error: 'Email invalid' }); 
    }
    if (emailExists(email)) {
        res.redirect(`/index.html?errorMsg=EmailExists.`)
        return res('Email already exists')
        //return res.json({ error: 'Email already exists' });
    }
    // Insert new user 
    
    const newUser = addUser(firstName, lastName, 2, 0, email);
    
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
    const date = new Date();
    date.setHours(date.getHours() + 2);
    const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);
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
    regActivity(1, getFormattedDate(), Number(idSubject), Number(idRoom), 2, 60)
    res.sendFile(path.join(staticPath, 'index.html'))
    
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






app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})