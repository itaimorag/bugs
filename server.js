const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cookieParser = require('cookie-parser')


const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const pdfService = require('./pdf.service')
const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Express Routing:
// app.get('/nono', (req, res) => res.redirect('/'))
// LIST
app.get('/api/bug', (req, res) => {
  const { title, description, severity, page } = req.query
  const filterBy = {
    title: title || '',
    description: description || '',
    severity: severity || false,
    page: +page || 0,
  }
  bugService.query(filterBy)
    .then(bugs => {
      res.send(bugs)
    })
})

app.get('/api/users', (req, res) => {
  userService.query()
    .then(users => {
      res.send(users)
    })
})

app.get('/api/user', (req, res) => {
  const user  = req.query
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Need to be logged in')

  var filterBy = {
    title:'',
    description:'',
    severity:false,
    page:0,
    userId:loggedinUser._id
  }
  bugService.query(filterBy)
    .then(bugs => {
      res.send(bugs)
    })
})

app.get('/api/user/full', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Need to be logged in')

  userService.getById(loggedinUser._id)
    .then(user => {
      res.send(user)
    })
})

app.get('/api/bug/makepdf', (req, res) => {
  bugService.query()
    .then(bugs => {
      pdfService.buildBugsPDF(bugs)
    })
})
// READ
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  const visitedBugs= req.cookies.visitedBugs || []
  if(visitedBugs.length<3) {
      const found = visitedBugs.find(currbugId => currbugId === bugId);
      if(!found){
          visitedBugs.push(bugId) 
          res.cookie('visitedBugs', visitedBugs,{maxAge:1000*7})
      }
  }
  else return res.status(401).send('Wait for a bit')
  bugService.getById(bugId)
    .then(bug => {
      res.send(bug)
    })


})
// ADD
app.post('/api/bug/', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Need to be logged in')
  const { title, description, severity, _id, createdAt } = req.body
  const bug = {
    title,
    description,
    severity,
    owner: loggedinUser,
  }
  bugService.save(bug).then((savedBug) => {
    res.send(savedBug)
  })
    .catch(() => {
      res.status(401).send(' couldnt be Added')
    })
})
// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Need to be logged in')

  const { title, description, severity, _id, createdAt,owner } = req.body
  const bug = {
    _id,
    title,
    description,
    severity,
    createdAt,
    owner,
  }
  bugService.save(bug, loggedinUser).then((savedBug) => {
    res.send(savedBug)
  })
    .catch(() => {
      res.status(401).send(' couldnt be changed!')
    })
})

app.delete('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Need to be logged in')

  const { bugId } = req.params
  bugService.remove(bugId, loggedinUser)
    .then(() => {
      res.send('Removed!')
    })
    .catch(() => {
      res.send(' couldnt be Removed!')
    })

})

app.post('/api/auth/login', (req, res) => {
  userService.checkLogin(req.body)
    .then(user => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)

      } else {
        res.status(401).send('Invalid login')
      }
    })
})
// SIGNUP
app.post('/api/auth/signup', (req, res) => {
  userService.save(req.body)
    .then(user => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged out')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)