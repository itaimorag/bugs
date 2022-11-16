
const fs = require('fs')
const gBugs = require('../data/bug.json')
const gUsers = require('../data/user.json')

module.exports = {
    query,
    getById,
    remove,
    save
}

const itemsPerPage =8

function query(filterBy) {
    
    const { title,description, severity,page,userId } = filterBy

    const regexTitle = new RegExp(title, 'i')
    const regexDescription = new RegExp(description, 'i')
    let filteredBugs = gBugs.filter((bug) => {
        return regexTitle.test(bug.title)&&regexDescription.test(bug.description)  
    }) 
    if(userId) filteredBugs=filteredBugs.filter((bug) =>bug.owner._id===userId) 
    if(severity!=='false') {
        filteredBugs.sort((bugA, bugB) => bugA.severity - bugB.severity)
    }
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    console.log(`filteredBugs = `, filteredBugs)
    return Promise.resolve({ totalPages, filteredBugs })
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId,loggedinUser) {
    const bugIdx = gBugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('cant find bug')
    const userIdx = gUsers.findIndex(currUser => currUser._id === loggedinUser._id)
    if ((gUsers[userIdx].isAdmin)||(gBugs[bugIdx].owner._id === loggedinUser._id)) {
        gBugs.splice(bugIdx, 1)
        return _saveBugsToFile()
    }
    else  return Promise.reject('Not your bug')
}

function save(bug,loggedinUser) {
    if (bug._id) {
        const bugIdx = gBugs.findIndex(currbug => currbug._id === bug._id)
        const userIdx = gUsers.findIndex(currUser => currUser._id === loggedinUser._id)
        if ((gUsers[userIdx].isAdmin)||(gBugs[bugIdx].owner._id === loggedinUser._id)) gBugs[bugIdx] = bug
        else  return Promise.reject('Not your bug')
    } else {
        bug._id = _makeId()
        bug.createdAt=Date.now()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() =>bug)
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)
        // if (rejected) return reject()
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
