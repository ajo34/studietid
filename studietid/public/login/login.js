const currentUrl = window. location. href; console. log(currentUrl);

if (currentUrl != 'http://localhost:3000/login/') {
    console.log('emailExist')
    document.getElementById('error').innerText = currentUrl.slice(48, currentUrl.length)
}

console.log('url', currentUrl)