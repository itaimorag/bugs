

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    makePdf
}

const BASE_URL = `/api/bug/` 


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}
function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function makePdf() {
    return axios.get(BASE_URL+'makepdf').then(res => res.data)
}

function save(bug) {
    if (bug._id) {
       return axios.put(BASE_URL + bug._id, bug).then((res) => res.data)
      } else {
       return axios.post(BASE_URL, bug).then((res) => res.data)
      }
}

function getEmptyBug() {
    return {
        title:'',
        severity:1,
        description: '',
    }
}