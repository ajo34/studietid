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


function edit(id) {
    document.getElementById("name").value = persons[id].name
    document.getElementById("age").value = persons[id].age
    document.getElementById("email").value = persons[id].email
    remove(id);
}
<button id="${id}" onclick="edit(${id})">edit</button>


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







function displayActivities(activities) {
    let idVar = 0

    // Tøm listene først
    uncheckedActivityList.innerHTML = `
    <tr>
        <th>idUser</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>`; 
    confirmedActivityList.innerHTML = `
    <tr>
        <th>idUser</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>`;
    deniedActivityList.innerHTML = `
    <tr>
        <th>idUser</th>
        <th>startTime</th>
        <th>subject</th>
        <th>room</th>
        <th>status</th>
        <th>duration</th>
    </tr>`;
    
    //persons.sort(function(a, b){return a.age - b.age})
    console.log(activities)
    activities.forEach(activity => {
        if (activity.status == 'Ubekreftet') {
            appendToRightActivityList(uncheckedActivityList, activity)
        } else if (activity.status == 'Bekreftet') {
            appendToRightActivityList(confirmedActivityList, activity)
        } else if (activity.status == 'Annulert') {
            appendToRightActivityList(deniedActivityList, activity)
        }
        
        idVar++;
    })
}
function appendToRightActivityList(activityList, activity ,idVar) {
    console.log(activityList, activity)
    activityList.innerHTML +=
        `<tr ondblclick="contextMenu(this.id)" id="${idVar}">
        <td>${activity.idUser}</td>
        <td>${activity.startTime}</td>
        <td>${activity.subject}</td>
        <td>${activity.room}</td>
        <td>${activity.status}</td>
        <td>${activity.duration}</td>
        <td><button onclick="confirmActivity()">confirm</button></td>
        </tr>`;
}





//google login 


/*import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import querystring from "querystring";
import cookieParser from "cookie-parser";
import {
    SERVER_ROOT_URI,
    GOOGLE_CLIENT_ID,
    JWT_SECRET,
    GOOGLE_CLIENT_SECRET,
    COOKIE_NAME,
    UI_ROOT_URI,
  } from "./config.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(
    cors({
      // Sets Access-Control-Allow-Origin to the UI URI
      origin: UI_ROOT_URI,
      // Sets Access-Control-Allow-Credentials to true
      credentials: true,
    })
  );
  
  app.use(cookieParser());

const redirectURI = "/google";

function getGoogleAuthURL() 
{
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${SERVER_ROOT_URI}${redirectURI}`,
      client_id: GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

app.get("/google/url", (req, res) => {
    res.send(getGoogleAuthURL());
});


// Getting the user from Google with the code
app.get(`/${redirectURI}`, async (req, res) => {
    const code = req.query.code;
  
    const { id_token, access_token } = await getTokens({
      code,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
    });
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    const token = jwt.sign(googleUser, JWT_SECRET);
  
    res.cookie(COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
  
    res.redirect(UI_ROOT_URI);
  });
  
  // Getting the current user
  app.get("/auth/me", (req, res) => {
    console.log("get me");
    try {
      const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
      console.log("decoded", decoded);
      return res.send(decoded);
    } catch (err) {
      console.log(err);
      res.send(null);
    }
  });
*/