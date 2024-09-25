
fetchUsers()
async function fetchUsers(){
    try {
        let response = await fetch('/getusers/');
        let data = await response.json();
        displayPersons(data);
        
    } catch (error) {
        console.error('Ereror', error);
    }
}

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
fetchActivities()
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


function displayActivities(activities) {
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



//remove/edit users section
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
