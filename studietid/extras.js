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
//confirmingActivity(3, 60, 3, '2024-09-05 07:13:56', 2)
//let result = addUser("fname", "lnam", 1, 1, "mo@amal")
//deleted = deleteUser('mo@amal')
//let activ = regActivity(63, getFormattedDate(), 3, 2, 2)
//console.log(getFormattedDate())

/*if(email.includes('@')) {
    let sql=db.prepare(`SELECT user.id FROM USER WHERE email = ?`);
    const info = sql.get(email)
    console.log('infolop:', info)
    //res.redirect('/app.html?errorMsg=Email already exists.')
    return info
} else {return true}*/
//"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"









/*function sorts() {
    let x = document.getElementById("skob").value
    if (x=="name") {
        persons.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })
    } else if (x=="age") {
        persons.sort(function(a, b){return a.age - b.age})
    } else if (x=="email") {
        persons.sort(function(a, b){
            if(a.email < b.email) { return -1; }
            if(a.email > b.email) { return 1; }
            return 0;
        })
    }
    displayPersons();
}*/



/*
*/


/*

})



    }*/







const enterBtn = document.getElementById('enter');
enterBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/enter/', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(persons) 
        }); 
    } catch (error) {
        document.getElementById('error').innerText = 1+ error; 
        document.getElementById('success').innerText = 'sum went wrong'; 
        }
})


app.post('/enter/'), (req, res) => {
    //res.sendFile(path.join(staticPath, 'eirikPage.html'));
    //return res.json({ error: 'Failed to register user.' });
}


<button id="enter">Enter</button>