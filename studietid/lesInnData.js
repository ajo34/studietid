import fs from 'fs';

const lines = fs.readFileSync('CSVFolder/grupper.csv', 'utf-8').split('\n')
const user = fs.readFileSync('CSVFolder/elevdata.csv', 'utf-8').split('\n')[1]
console.log('HEEEEEEYYAAAA')
let data = {
    subjects: {
        name: [],
        code: [],
        class: [],
    }, 
    classes: []
        }
let arr = [];

function formatInSubjects() {
    for (let line of lines) {

    let data = line.split(';')
    arr.push(data.filter(clearEmptyAndRows));
    
    }
    let arr2 = [];
    for (let i = 0; i < arr.length-1; i+=2) {
        arr[i].push(arr[i+1][0])
        
        arr2.push(arr[i])
        
    }
    arr2[0].shift()
    return arr2
}

function putTogether() {
    let arr = formatInSubjects()
    for (let i = 0; i < arr.length; i++) {
        data.subjects.name.push(arr[i][5])
        data.subjects.code.push(arr[i][1])
        data.subjects.class.push(arr[i][3])
    }
    data.classes = makeClassSet()
    return data
}
//line 393 and 622 should just be ;;;;;;;
console.log(putTogether())
//putTogether().subjects.name[309], putTogether().subjects.class[309], putTogether().classes[309]
function clearEmptyAndRows(s) {
    if (s != '' && s != '\r') {
        return s
    }
}

function makeClassSet() {
    let arr = data.subjects.class
    let arr2 = []
    

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(',')) {
            arr[i] = arr[i].split(',')
        }
        
    } 
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            for (let j in arr[i]) {
                arr2.push(arr[i][j].trim())
            }
        } else {
            arr2.push(arr[i])
        }
    }
    return new Set(arr2)
}

//'3MKA, 3PBYA, 3STA, 3STB, 3STC, 3STD, 3STE, 3STF, 3STG, 3STH'.split(',')

export function regclass(names){
    for (let i in names) {
        let sql = db.prepare(`INSERT INTO class (name) VALUES (?)`)
        const info = sql.run(names[i])
    }
    
    console.log(info)
}


regclass(data.classes)