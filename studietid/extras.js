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


function remove(id) {
    persons.splice(id, 1);
    displayPersons();
}






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


/*const regForm = document.getElementById('registerForm') 
//regForm.addEventListener('submit', adduser) 
async function adduser(event) {
    event.preventDefault(); 
    const user = { 
        firstName: regForm.firstName.value,
        lastName: regForm.lastName.value, 
        idRole: 2, 
        isAdmin: 0, 
        email: regForm.email.value 
    }; 
    console.log(user);
        try { 
            const response = await fetch('/adduser/', { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(user) 
            }); 

            const data = await response.json(); 
            
            if (data.error) { 
                document.getElementById('error').innerText = data.error; 
                document.getElementById('success').innerText = 'sum went wrong'; } 
                else { 
                    document.getElementById('error').innerText = ''; 
                    document.getElementById('success').innerText = 'Bruker registrert.'; }
            } catch (error) { 
                    document.getElementById('error').innerText = 'En feil oppstod. Vennligst prøv igjen.'; 
                    console.error('Errore:', error); 
                } 
            } */



displayPersons();
//displayActivities();



function randPpl(info) {
    persons = []
    for (let i=0; i<info.length; i++) {
        console.log(info[i]);
        let person = {
            "firstName": info[i].firstName,
            "lastName": info[i].lastName,
            "idRole": info[i].role,
            "isAdmin": info[i].isAdmin,
            "email": info[i].email,
        }
        persons.push(person);
        displayPersons();
    } 
    
}


/*activities = []
    for (let i=0; i<info.length; i++) {
        console.log(info[i]);
        let activity = {
            "idUser": info[i].idUser,
            "startTime": info[i].startTime,
            "subject": info[i].subject,
            "room": info[i].room,
            "status": info[i].status,
            "duration": info[i].duration,
        }
        activities.push(activity);
        
    }*/