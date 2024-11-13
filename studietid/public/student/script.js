
fetchSubjectRoom()
fetchUserDetails()
//const params = new URLSearchParams(window.location.search);
//const errorMsg = params.get('errorMsg');
//console.log(errorMsg);
let activeUserId = ""
async function fetchUserDetails() {
    try {
        let response = await fetch('/getuserdetails/');
        let data = await response.json();
        console.log(data)
        document.getElementById('firstNameTitle').innerText = data.firstName + " " + data.lastName;
        document.getElementById('emailTitle').innerText = data.email;
        activeUserId = data.userid
    } catch (error) {
        console.error('Error:', error);
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


fetchActivities()
async function fetchActivities(){
    try {
        let response = await fetch('/getactivities/');
        let data = await response.json();
        console.log(data)
        displayActivityList(data); //Display activitylists
        
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

document.getElementById('lightBtn').addEventListener('click',lightMode)




function displayActivityList(activities) {
    const activityList = document.getElementById('activityList');
    let idVar = 0

    // Tøm listene først
    activityList.innerHTML = `
    <tr>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>`; 
    
    //persons.sort(function(a, b){return a.age - b.age})
    
    activities.forEach(activity => {
        
        activityList.innerHTML +=
        `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
        <td>${activity.startTime}</td>
        <td>${activity.subject}</td>
        <td>${activity.room}</td>
        <td>${activity.status}</td>
        <td>${activity.duration}</td>
        </tr>`;
        
        idVar++;
        
    })
}


let params = {}

let regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(location.href)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

if(Object.keys(params).length !== 0){
    localStorage.setItem('authInfo', JSON.stringify(params))
} else {
    console.log('no token')
}

//hide token
//window.history.pushState({}, document.title, "/" + "student" + "/");

let info = JSON.parse(localStorage.getItem('authInfo'))
console.log(JSON.parse(localStorage.getItem('authInfo')))
console.log('log', info['access_token'])
console.log(info['expires_in'])

console.log(info)
fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
    headers: {
        'Authorization': `Bearer ${info['access_token']}`
    }
})
.then((data) => data.json())
.then((info) => {
    console.log(info)
})


function logout() {

}


function lightMode(){
    console.log('lightMode')
    const newLink = document.createElement('link')
    newLink.rel = 'stylesheet'
    newLink.href = '../light.css'
    document.head.replaceChild(newLink, document.getElementById('styl'));
}
