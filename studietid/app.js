const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const express = require('express')
const app = express()

const staticPath = path.join(__dirname, 'public')


app.get('/', (req, resp) => {
    resp.sendFile(path.join(staticPath, 'app.html'))
})


app.get('/getusers/', (req, res) =>{
    let sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, role.name as role 
        FROM user inner join role on user.idrole = role.id `);
    let users = sql.all()
    console.log("users.length",users.length)
    
    res.send(users)
})
//let result = addUser("fname", "lnam", 1, 1, "mo@amal")
//deleted = deleteUser('mo@amal')
//let activ = regActivity(63, getFormattedDate(), 3, 2, 2)
console.log(getFormattedDate())
function addUser(firstName, lastName, idRole, isAdmin, email)
 {
    if(!eMailCheck(email)){
        let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email)  
                            values (?, ?, ?, ?, ?)`)
        const info = sql.run(firstName, lastName, idRole, isAdmin, email)
        
        sql = db.prepare(`
            SELECT user.id as userid, firstname, lastname, email, role.name as role 
            FROM user inner join role on user.idrole = role.id 
            WHERE user.id  = ?`);
        let rows = sql.all(info.lastInsertRowid)
        console.log("rows.length",rows)
        return rows[0]
    }
}

function eMailCheck(email) {
    if(email.includes('@')) {
        let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
        const info = sql.get(email)
        console.log('infolop:', info)
        return info
    } else {return true}
}

function deleteUser(email){
    let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
    let info = sql.get(email).id
    let temp = info
    console.log('AAAAAAAA:', info)
    sql=db.prepare(`DELETE FROM activity WHERE idUser = ?`);
    info = sql.run(temp)
    sql=db.prepare(`DELETE FROM USER WHERE email = ?`);
    info = sql.run(email)
}
function getFormattedDate() {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function regActivity(idUser, startTime, idSubject, idRoom, idStatus){
    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus)
                        values (?, ?, ?, ?, ?)`)
    const info = sql.run(idUser, startTime, idSubject, idRoom, idStatus)
    console.log(info)
}
function confirmingActivity(yes, duration, idUser, startTime,  idStatus){
    let sql = db.prepare(`UPDATE activity SET idStatus = ?, duration = ? WHERE idUser = ? AND startTime = ? AND idStatus = ?`)
    const info = sql.run(yes, duration, idUser, startTime,  idStatus)
    console.log(info)
}
confirmingActivity(3, 60, 3, '2024-09-05 07:13:56', 2)

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})