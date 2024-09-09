fetchUsers()

async function fetchUsers(){
    try {
        let response = await fetch('/getusers/');
        let data = await response.json();
        console.log(data);
        
        for (let i= 0 ; i < data.length; i++){
            console.log(data[i]);
        }
    } catch (error) {
        console.error('Ereror', error);
    }
}






// Eksempel på en liste med personer
/*let persons = [
    {
        "name": "Ola Nordmann",
        "age": 30,
        "email": "ola@example.com",
    },
    {
        "name": "1Kari Nordmann",
        "age": 25,
        "email": "kari@example.com",
    }
];
/*

function sorts() {
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
}




let idVar = 0
//document.getElementById('addPersonBtn').addEventListener('click', addPerson);
fetchRandomUsers()
const personList = document.getElementById('personList');
// Funksjon for å vise listen med personer på nettsiden
function displayPersons() {
    idVar=0
    personList.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
    </tr>`; // Tøm listen først
    //persons.sort(function(a, b){return a.age - b.age})
    
    persons.forEach(person => {
        personList.innerHTML +=
        `<tr oncontextmenu="contextMenu(this.id)" id="${idVar}"><td>${person.name}</td>
        <td>${person.age} år</td>
        <td>Email: ${person.email}</td>
        </tr>`;
        idVar++;
    })
    
}

// Funksjon for å legge til en ny person til listen
function addPerson() {
    const newPerson = {
        "name": document.getElementById("name").value,
        "age": document.getElementById("age").value,
        "email": document.getElementById("email").value,
        "id": idVar
    };
    document.getElementById("email").value = ""
    document.getElementById("name").value = ""
    document.getElementById("age").value = ""
    idVar++;
    persons.push(newPerson);
    sorts() // Oppdater visningen
}



// Kall funksjonen for å vise listen med en gang siden lastes
displayPersons();
const menu = document.getElementById("menu")
function contextMenu(id){
    
    menu.innerHTML =`
        <button id="${id}" onclick="remove(${id})">delet</button>
        <button id="${id}" onclick="edit(${id})">edit</button>`
    menu.style.display="block"
    menu.style.top=(`${event.clientY}px`)
    menu.style.left=(`${event.clientX}px`)
    
}
function remove(id) {
    persons.splice(id, 1);
    displayPersons();
}
function edit(id) {
    document.getElementById("name").value = persons[id].name
    document.getElementById("age").value = persons[id].age
    document.getElementById("email").value = persons[id].email
    remove(id);
}
document.body.addEventListener("click", function(){
    menu.style.display = "none";
})


// Funksjon for å hente tilfeldige brukere fra Random User API

    async function fetchRandomUsers() {
        try {
            // Fetch API brukes for å hente data fra URLen
            let response = await fetch('https://randomuser.me/api/?results=8'); // Henter 5 tilfeldige brukere
            let data = await response.json(); // Konverterer responsen til JSON
            console.log(data); // Logger hentet data for testing
            //let gender=data.results[0].gender
            //document.getElementById("thingy").innerHTML = gender
            randPpl(data)
        } catch (error) {
            console.error('Error:', error); // Håndterer eventuelle feil
        }
    }
    
function randPpl(info) {
    for (let i=0; i<info.results.length; i++) {
        persons.push(info)
        document.getElementById("name").value = info.results[i].name.first + " " + info.results[i].name.last
        document.getElementById("age").value = info.results[i].dob.age
        document.getElementById("email").value = info.results[i].email
        addPerson();
    }
    let gender=info.results[0].gender
}*/