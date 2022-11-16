const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'


export const userService = {
    getLoggedInUser,
    login,
    logout,
    signup,
    getUserBugs,
    getFullUser,
    getUsers,

}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getUserBugs(user){
    return axios.get("/api/user").then((res) => res.data)
}

function getUsers(){
    return axios.get("/api/users").then((res) => res.data)
}

function getFullUser(){
    return axios.get("/api/user/full").then((res) => res.data)
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}


function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}