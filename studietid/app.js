const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const staticPath = path.join(__dirname, 'public')


app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'))
})


app.get('/getusers/', (req, res) =>{
    let sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, role.name as role 
        FROM user inner join role on user.idrole = role.id `);
    let users = sql.all()
    console.log("users.length",users.length)
    
    res.send(users)
    
})

function addUser(firstName, lastName, idRole, isAdmin, email)
{
    console.log('firster')
    
    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email)  
                        values (?, ?, ?, ?, ?)`)
    const info = sql.run(firstName, lastName, idRole, isAdmin, email)

    console.log('second')
    sql = db.prepare(`
        SELECT user.id as userid, firstname, lastname, email, role.name as role 
        FROM user inner join role on user.idrole = role.id WHERE user.id  = ?`);
    
    console.log('third')
    let rows = sql.all(info.lastInsertRowid)
    console.log("row inserted",rows[0])
    console.log('fourth')
    return rows[0]
    
}

function eMailCheck(email) {
    return false
    if(email.includes('@')) {
        let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
        const info = sql.get(email)
        console.log('infolop:', info)
        //res.redirect('/app.html?errorMsg=Email already exists.')
        return info
    } else {return true}
}






app.post('/adduser/', (req, res) => {
    console.log('5th')
    const { firstName, lastName, idRole, isAdmin, email } = req.body;
    if (eMailCheck(email)) { 
        return res.json({ error: 'Email already exists.' }); 
    }
    console.log('6th')
    // Insert new user 
    
    const newUser = addUser(firstName, lastName, 2, 0, email);
    console.log('HEI' + newUser)
    if (!newUser) { 
        //return res.json
        console.log({ error: 'Failed to register user.' }); 
        return 1
    }
    console.log({ message: 'User registered successfully!', user: newUser }); 
    console.log('7th')
    
    if (!newUser) {
        return res.json({ error: 'Failed to register user.' });
    }

    res.sendFile(path.join(staticPath, 'app.html'))
});



app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})