// file for sql query functions

import Database from 'better-sqlite3';
const db = new Database('studietid.db', { verbose: console.log });
console.log(db)

export function getUser(id) {
    console.log(id)
    let sql = db.prepare('SELECT user.id as userid, firstname, lastname, email, password, isAdmin, role.name  as role FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
    let rows = sql.all(id)
    console.log(rows[0])
    
    return rows[0]
}


export function addUser(firstName, lastName, idRole, isAdmin, email, password){
    
    
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


export function checkValidEmail(email) {
    let re = RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    if (!re.test(email)) {
        return true
    } else {return false}

}

export function emailExists(email) {
    console.log(email)
    let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
    const info = sql.get(email)
    
    return info
}



export function deleteUser(email){

    let sql = db.prepare(`
    SELECT user.id as userid, firstname, lastname, email
    FROM user WHERE email  = ?`);
    
    sql = db.prepare(`DELETE FROM user WHERE email = ?`);
    const info = sql.run(email)

    
}




export function getFormattedDate() {
    const date = new Date().toLocaleString('sv-SE', {timeZone: 'Europe/Oslo'});
    const formattedDate = date.toString().replace('T', ' ').slice(0, 19);
    return formattedDate;
}


export function regActivity(idUser, startTime, idSubject, idRoom, idStatus, duration){
    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration)
                        values (?, ?, ?, ?, ?, ?)`)
    const info = sql.run(idUser, startTime, idSubject, idRoom, idStatus, duration)
    console.log(info)

}


export function updateActivity(  idTeacher, idStatus, idActivity){
    
    let sql = db.prepare(`UPDATE activity set idTeacher = ?, idStatus = ? WHERE id = ?`)
    const info = sql.run(idTeacher, idStatus, idActivity)
    console.log(info)
    if (info.changes !== 0) {
        return 0
    } else {
        return { error: 'Failed to confirm activity.' }
    }
}


export function deleteActivity(idActivity){
    let sql = db.prepare(`DELETE FROM activity WHERE id = ?`);
    const info = sql.run(idActivity)
    console.log(info)
    
}


export function getUsers(){
    console.error('hei')
    let sql = db.prepare(`
        SELECT user.id as userid, 
        firstname, 
        lastname, 
        email, 
        role.name as role 
        FROM user inner join 
        role on user.idrole = role.id `);

    return sql.all()

}

export function getAllActivities() {
    let sql = db.prepare(`
        SELECT activity.id AS idActivity, 
        startTime, 
        user.firstName AS firstName, 
        user.lastName AS lastName, 
        subject.name AS subject, 
        room.name AS room, 
        status.name AS status, 
        duration
        From activity INNER JOIN 
        subject ON activity.idsubject = subject.id, 
        user ON activity.iduser=user.id, 
        room ON activity.idroom = room.id, 
        status ON activity.idstatus = status.id `)
    return sql.all()
t
}

export function getActivities(userId) {
    let sql = db.prepare(`
        SELECT activity.id AS idActivity, startTime, subject.name AS subject, room.name AS room, status.name AS status, duration
        From activity INNER JOIN subject ON activity.idsubject = subject.id, user ON activity.iduser=user.id, room ON activity.idroom = room.id, status ON activity.idstatus = status.id 
        WHERE user.id = ?`)
    return sql.all(userId)
}

export function getSubjectRoom() {
    let sql = db.prepare(`
        SELECT subject.name as subject, subject.id as idSubject, room.id as idRoom, room.name as room
        FROM subject inner join room on subject.id = room.id `);
    return sql.all()
}

export function getUserDetails(userId) {
    let sql = db.prepare(`SELECT user.id as userid, firstname, lastname, email FROM user WHERE userid = ?`)
    return sql.all(userId)[0]
}