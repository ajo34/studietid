const sqlite3 = require('better-sqlite3')
const db = sqlite3('./studietid.db', {verbose: console.log})


//let result = addUser("fname", "lnam", 1, 1, "momal")
let deleted = deleteUser('mal')

function addUser(firstName, lastName, idRole, isAdmin, email)
 {
    if(!eMailDunExist(email)){
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

function eMailDunExist(email) {
    let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
    const info = sql.get(email)
    console.log('infolop:', info)
    return info
}

function deleteUser(email){
    let sql=db.prepare(`DELETE FROM USER WHERE email = ?`);
    const info = sql.run(email)
}