fetchUsers()
fetchSubjectRoom()
fetchActivities()
const params = new URLSearchParams(window.location.search);
const errorMsg = params.get('errorMsg');
console.log(errorMsg);


async function fetchUsers(){
    try {
        let response = await fetch('/getusers/');
        let data = await response.json();
        displayPersons(data);
        
    } catch (error) {
        console.error('Ereror', error);
    }
}
async function fetchActivities(){
    try {
        let response = await fetch('/getactivities/');
        let data = await response.json();
        console.log(data)
        displayActivities(data);
        
    } catch (error) {
        console.error('Ereror', error);
    }
}
async function fetchSubjectRoom(){
    try {
        let response = await fetch('/getsubjectroom/');
        let data = await response.json();
        subRom(data);
        console.log(data)

    } catch (error) {
        console.error('Ereror', error);
    }
}

function subRom(data){
    const roomSelect = document.getElementById('roomSelect')
    const subjectSelect = document.getElementById('subjectSelect')
    for (let i = 0; i < data.length; i++) {
    const rOption = document.createElement('option')
    rOption.textContent = data[i].room
    rOption.value=data[i].idRoom
    roomSelect.appendChild(rOption)

    const sOption = document.createElement('option')
    sOption.textContent = data[i].subject
    sOption.value=data[i].idSubject
    subjectSelect.appendChild(sOption)
    }

}





// Eksempel på en liste med personer
let persons = [
    {
        "firstName": "Ola ",
        "lastName": " Nordmann",
        "idRole": 0,
        "isAdmin": 0,
        "email": "ola@example.com",
    },
    {

        "firstName": "1Kari ",
        "lastName": " Nordmann",
        "idRole": 0,
        "isAdmin": 0,
        "email": "kari@example.com",
    }
];

let activities = [
    {
        "idUser": 1,
        "startTime": "2021-12-12 08:00:00",
        "subject": "norsk",
        "room": "416",
        "status": "Not started",
        "duration": "60"
    },
    {
        "idUser": 2,
        "startTime": "2021-12-12 08:00:00",
        "subject": "matematikk",
        "room": "416",
        "status": "Not started",
        "duration": "60"
    }
]






const personList = document.getElementById('personList');
// Funksjon for å vise listen med personer på nettsiden
function displayPersons(persons) {
    let idVar = 0

    
    personList.innerHTML = `
    <tr>
        <th>First name</th>
        <th>Last name</th>
        <th>Role</th>
        <th>Email</th>
    </tr>
    `; // Tøm listen først
    //persons.sort(function(a, b){return a.age - b.age})
    
    persons.forEach(person => {
        personList.innerHTML +=
        `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.role}</td>
        <td>${person.email}</td>
        </tr>`;
        idVar++;
    })
    
}
const activityList = document.getElementById('activityList');
function displayActivities(activities) {
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
    let idVar = 0

    
    activityList.innerHTML = `
    <tr>
        <th>idUser</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>
    `; // Tøm listen først
    //persons.sort(function(a, b){return a.age - b.age})
    console.log(activities)
    activities.forEach(activity => {
        activityList.innerHTML +=
        `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
        <td>${activity.idUser}</td>
        <td>${activity.startTime}</td>
        <td>${activity.subject}</td>
        <td>${activity.room}</td>
        <td>${activity.status}</td>
        <td>${activity.duration}</td>
        </tr>`;
        idVar++;
    })
}


// Kall funksjonene for å vise listen med en gang siden lastes
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
const menu = document.getElementById("menu")
document.body.addEventListener("click", function(){
    menu.style.display = "none";})
function contextMenu(id){
    
    menu.innerHTML =`
        <button id="${id}" onclick="removeuser(${id})">delet</button>
        <button id="${id}" onclick="edit(${id})">edit</button>`
    menu.style.display="block"
    menu.style.top=(`${event.clientY}px`)
    menu.style.left=(`${event.clientX}px`)
    
}
function edit(id) {
    document.getElementById("name").value = persons[id].name
    document.getElementById("age").value = persons[id].age
    document.getElementById("email").value = persons[id].email
    remove(id);
}

async function removeuser(id) {
    const user = persons[id]
    console.log('email to be deleted: ' + user.email);
        try { 
            const response = await fetch('/removeuser/', { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(user) 
            })
            
        } catch (error) {
            document.getElementById('error').innerText = error; 
            document.getElementById('success').innerText = 'sum went wrong wit removing';
        }
}

