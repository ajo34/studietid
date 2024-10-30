
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
        <th>idActivity</th>
        <th>idUser</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>`; 
    
    //persons.sort(function(a, b){return a.age - b.age})
    
    activities.forEach(activity => {
        if (activity.idUser == activeUserId) {
            activityList.innerHTML +=
            `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
            <td>${activity.idActivity}</td>
            <td>${activity.idUser}</td>
            <td>${activity.startTime}</td>
            <td>${activity.subject}</td>
            <td>${activity.room}</td>
            <td>${activity.status}</td>
            <td>${activity.duration}</td>
            </tr>`;
            
            idVar++;
        }
    })
}



function lightMode(){
    console.log('lightMode')
    const newLink = document.createElement('link')
    newLink.rel = 'stylesheet'
    newLink.href = 'light.css'
    document.head.replaceChild(newLink, document.getElementById('styl'));
}
