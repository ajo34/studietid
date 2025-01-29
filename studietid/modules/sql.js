// file for sql query functions

import Database from 'better-sqlite3';
const db = new Database('studietid.db', { verbose: console.log });
console.log(db)

export function getUser(id) {
    console.log(id)
    let sql = db.prepare('SELECT user.id as userid, firstname, lastname, email, password, isAdmin, class, role.name  as role FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
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

export function getRoom() {
    let sql = db.prepare(`
        SELECT room.id as idRoom, room.name as room
        FROM room`);
    return sql.all()
}

export function getSubject(classId) {
    let sql = db.prepare(`
        SELECT class_subject.subject as idSubject, subject.name as subject FROM class_subject 
        INNER JOIN subject on subject.id = class_subject.subject WHERE class = ? `);
    return sql.all(classId)
}

export function getUserDetails(userId) {
    let sql = db.prepare(`SELECT user.id as userid, firstname, lastname, email FROM user WHERE userid = ?`)
    return sql.all(userId)[0]
}


//getting classes and subs from csv stuff starts here

export function regClass(name){
    let sql = db.prepare(`INSERT INTO class (name) VALUES (?)`)
    const info = sql.run(name)
    console.log(info)
}

export function regSubject(name, code){
    let sql = db.prepare(`INSERT INTO subject (name, code) VALUES (?, ?)`)
    const info = sql.run(name, code)
    console.log(info)
}

export function insertClassSubjectRelations(classId, subjectId) {
    let sql = db.prepare(`INSERT INTO class_subject (class, subject) VALUES (?, ?)`)
    const info = sql.run(classId, subjectId)
    console.log(info)
}

export function getClassesAndSubjects(className, subjectCode) {
    let sql = db.prepare(`
        SELECT class.id as classId, subject.id as subjectId FROM class 
        INNER JOIN subject ON subject.code = ? 
        WHERE class.name = ?`)
    const info = sql.get(className, subjectCode)
    return info
}


export function subjectExists(subjectName) {
    console.log(subjectName)
    let sql=db.prepare(`SELECT subject.id FROM subject WHERE code = ?`);
    const info = sql.get(subjectName)
    
    return info
}