import fs from 'fs';
import {regClass, subjectExists, regSubject, getClassesAndSubjects, insertClassSubjectRelations} from './modules/sql.js';
import util from 'util';

const lines = fs.readFileSync('CSVFolder/grupper.csv', 'utf-8').split('\n')
const user = fs.readFileSync('CSVFolder/elevdata.csv', 'utf-8').split('\n')[1]
console.log('HEEEEEEYYAAAA')
let data = {
    subjects: {
        name: [],
        code: [],
        class: [],
    }, 
    classes: [],
    uniqueSubjects: []
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

export function putTogether() {
    let arr = formatInSubjects()
    for (let i = 0; i < arr.length; i++) {
        data.subjects.name.push(arr[i][arr[i].length-1])
        data.subjects.code.push(arr[i][1])
        data.subjects.class.push(arr[i][3])
    }
    data.classes = makeClassSet()
    data.uniqueSubjects = Array.from(new Set(data.subjects.name))
    return data
}
//line 393 and 622 should just be ;;;;;;;
console.log(util.inspect(putTogether(), { maxArrayLength: null }))

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
        //Big important change here
        /*if (arr[i].includes(',')) {
            arr[i] = arr[i].split(',')
        }*/
        arr[i] = arr[i].split(', ')
        
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
    
    return Array.from(new Set(arr2))
}

//'3MKA, 3PBYA, 3STA, 3STB, 3STC, 3STD, 3STE, 3STF, 3STG, 3STH'.split(',')


const test = ['3MKA', '3PBYA', '3STA', '3STB', '3STC', '3STD', '3STE', '3STF', '3STG', '3STH']

function insertAllClasses(classes){
    for (let i in classes) {
        regClass(classes[i])
    }
}
//console.log(insertAllClasses(data.classes))

function insertAllSubjects(subjects) {
    for (let i in subjects.name) {
        if(subjectExists(subjects.code[i])) {
            console.log('Subject already exists: ', subjects.name[i])
        } else {
            regSubject(subjects.name[i], subjects.code[i])
            console.log('Subject does not exist: ', subjects.name[i])
        }
    }
}
//console.log(insertAllSubjects(data.subjects))

console.log(getClassesAndSubjects('HIS1009', '3MKA'))

function insertAllClassSubjectRelations(subjects, classes) {
    for (let i in subjects) {
        if (Array.isArray(classes[i])) {
            console.log('MULTI')
            for (let j in classes[i]) {
                let dita = getClassesAndSubjects(subjects[i], classes[i][j])
                let classId = dita.classId
                let subjectId = dita.subjectId
                console.log("dita:", "classname:", classes[i], "subjectname:", subjects[i], "classid", classId, "subjectid", subjectId, dita)
                insertClassSubjectRelations(classId, subjectId)
            }
        } else {
            let dita = getClassesAndSubjects(subjects[i], classes[i])
            let classId = dita.classId
            let subjectId = dita.subjectId
            console.log("dita:", "classname:", classes[i], "subjectname:", subjects[i], "classid", classId, dita)
            insertClassSubjectRelations(classId, subjectId)
        }
    }
}

console.log(insertAllClassSubjectRelations(data.subjects.code, data.subjects.class))