

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 
function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
    form.innerHTML += `<p>Hei</p>`;
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': '378567521950-j66emc4a332v8ggc57ldlf27qbkg1dqr.apps.googleusercontent.com',
                  'redirect_uri': 'http://localhost:3000/student/',
                  'response_type': 'token',
                  'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile',
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'};
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
    
}
*/




const currentUrl = window. location. href; console. log(currentUrl);

if (currentUrl != 'http://localhost:3000/login/') {
    
    switch (currentUrl.slice(48, currentUrl.length)){
        case "EmailExists.":
            document.getElementById('error').innerText = "Email already in use"
            break;
        case "WrongPassword.":
            document.getElementById('error').innerText = "The password is incorrect"
            break;
        case "UgyldigEmail.":
            document.getElementById('error').innerText = "Invalid email"
            break;
    }
    //document.getElementById('error').innerText = currentUrl.slice(48, currentUrl.length)
}

console.log('url', currentUrl)