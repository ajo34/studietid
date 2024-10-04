
fetchSubjectRoom()

//const params = new URLSearchParams(window.location.search);
//const errorMsg = params.get('errorMsg');
//console.log(errorMsg);




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

document.getElementById('lightBtn').addEventListener('click',lightMode)

function lightMode(){
    console.log('lightMode')
    const newLink = document.createElement('link')
    newLink.rel = 'stylesheet'
    newLink.href = 'light.css'
    document.head.replaceChild(newLink, document.getElementById('styl'));
}
