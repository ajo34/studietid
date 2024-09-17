
fetchUsers()

const params = new URLSearchParams(window.location.search);
const errorMsg = params.get('errorMsg');
console.log(errorMsg);
async function fetchUsers(){
    try {
        let response = await fetch('/getusers/');
        let data = await response.json();
        console.log(2+ data);
        randPpl(data);
        /*for (let i= 0 ; i < data.length; i++){
            
            randPpl(data[i]);
        }*/
    } catch (error) {
        console.error('Ereror', error);
    }
}



const regForm = document.getElementById('registerForm') 
//regForm.addEventListener('submit', adduser) 
async function adduser(event) {
    event.preventDefault(); 
    const user = { 
        firstName: regForm.firstName.value,
        lastName: regForm.lastName.value, 
        idRole: 2, isAdmin: 0, 
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
            fetchUsers();
            //persons = []
            randPpl();
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







let idVar = 0
const personList = document.getElementById('personList');
// Funksjon for å vise listen med personer på nettsiden
function displayPersons() {

    idVar=0
    
    personList.innerHTML = `
    <tr>
        <th>firstName</th>
        <th>lastName</th>
        <th>idRole</th>
        <th>isAdmin</th>
        <th>Email</th>
    </tr>
    `; // Tøm listen først
    //persons.sort(function(a, b){return a.age - b.age})
    
    persons.forEach(person => {
        personList.innerHTML +=
        `<tr oncontextmenu="contextMenu(this.id)" id="${idVar}">
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.idRole}</td>
        <td>${person.isAdmin}</td>
        <td>Email: ${person.email}</td>
        </tr>`;
        idVar++;
    })
    
}



// Kall funksjonen for å vise listen med en gang siden lastes
displayPersons();

function remove(id) {
    persons.splice(id, 1);
    displayPersons();
}

    
function randPpl(info) {
    for (let i=0; i<info.length; i++) {
        console.log(info[i]);
        let person = {
            "firstName": info[i].firstName,
            "lastName": info[i].lastName,
            "idRole": info[i].idRole,
            "isAdmin": info[i].isAdmin,
            "email": info[i].email,
        }
        persons.push(person);
        displayPersons();
    } console.log(1+ persons)
    
}