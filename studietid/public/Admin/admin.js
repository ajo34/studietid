
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
        <th>Class</th>
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
        <td>${person.class}</td>
        </tr>`;
        idVar++;
    })
    
}


fetchActivities()
async function fetchActivities(){
    try {
        let response = await fetch('/getallactivities/');
        let data = await response.json();
        console.log(data)
        activityListDisplayer(data); //Display activitylists
        
    } catch (error) {
        console.error('Ereror', error);
    }
}

//calls all display functions
function activityListDisplayer(activities){
    displayUncheckedActivityList(activities)
    displayConfirmedActivities(activities)
    displayDeniedActivities(activities)
}


function displayUncheckedActivityList(activities) {
    const activityList = document.getElementById('uncheckedActivityList');
    let idVar = 0

    // Tøm listene først
    activityList.innerHTML = `
    <tr>
        <th>student</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>duration</th>
    </tr>`; 
    
    //persons.sort(function(a, b){return a.age - b.age})
    
    activities.forEach(activity => {
        if (activity.status == 'Ubekreftet') {
            activityList.innerHTML +=
            `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
            <td>${activity.firstName} ${activity.lastName}</td>
            <td>${activity.startTime}</td>
            <td>${activity.subject}</td>
            <td>${activity.room}</td>
            <td>${activity.duration}</td>
            <td>
                <button onclick="updateActivity(${activity.idActivity}, 3)">confirm</button>
                <button onclick="updateActivity(${activity.idActivity}, 1)">deny</button>
            </td>
            </tr>`;
            
            idVar++;
        }
    })
}

function displayConfirmedActivities(activities) {
    const activityList = document.getElementById('confirmedActivityList');
    let idVar = 0

    // Tøm listene først
    activityList.innerHTML = `
    <tr>
        <th>student</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>duration</th>
    </tr>`; 
    
    //persons.sort(function(a, b){return a.age - b.age})
    
    activities.forEach(activity => {
        if (activity.status == 'Bekreftet') {
            activityList.innerHTML +=
            `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
            <td>${activity.firstName} ${activity.lastName}</td>
            <td>${activity.startTime}</td>
            <td>${activity.subject}</td>
            <td>${activity.room}</td>
            <td>${activity.duration}</td>
            <td><button onclick="updateActivity(${activity.idActivity}, 1)">deny</button></td>
            </tr>`;
            
            idVar++;
        }
    })
}

function displayDeniedActivities(activities) {
    const activityList = document.getElementById('deniedActivityList');
    let idVar = 0

    // Tøm listene først
    activityList.innerHTML = `
    <tr>
        <th>student</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>duration</th>
    </tr>`; 
    
    //persons.sort(function(a, b){return a.age - b.age})
    
    activities.forEach(activity => {
        if (activity.status == 'Annulert') {
            activityList.innerHTML +=
            //adds invis contextmenu
            `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
            <td>${activity.firstName} ${activity.lastName}</td>
            <td>${activity.startTime}</td>
            <td>${activity.subject}</td>
            <td>${activity.room}</td>
            <td>${activity.duration}</td>
            <td>
                <button onclick="updateActivity(${activity.idActivity}, 3)">confirm</button>
                <button onclick="deleteActivity(${activity.idActivity})">delete</button>
            </td>
            </tr>`;
            
            idVar++;
        }
    })
}


//remove/edit users section
const menu = document.getElementById("menu")
document.body.addEventListener("click", function(){
    menu.style.display = "none";})


function contextMenu(id){
    menu.innerHTML =`
        <button id="${id}" onclick="removeuser(${id})">delet</button>`
    menu.style.display="block"
    menu.style.top=(`${event.clientY}px`)
    menu.style.left=(`${event.clientX}px`)
    
}


async function removeuser(id) {
    console.log(persons)
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



async function updateActivity(idActivity, status) {
    let activity = {
        idTeacher: 1,
        idStatus: status,
        idActivity: idActivity
    }
    try {
        const response = await fetch('/updateactivity/', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(activity) 
        }); 
        fetchActivities()
        if (data.error) {
            document.getElementById('error').innerText = data.error
            document.getElementById('success').innerText = ''
        } else { 
            document.getElementById('success').innerText = data.message
            document.getElementById('error').innerText = ''
        }
        
    } catch (error) {
        document.getElementById('error').innerText = 8+ error; 
        document.getElementById('success').innerText = 'sum went wrong'; 
    }
}

async function deleteActivity(activityid) {
    console.log('activity to be deleted: ' + activityid);
    let idActivity = {
        idActivity: activityid
    }
    try { 
        const response = await fetch('/removeactivity/', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(idActivity)
        })
        fetchActivities()
    } catch (error) {
        document.getElementById('error').innerText = error; 
        document.getElementById('success').innerText = 'sum went wrong wit removing';
    }
}


