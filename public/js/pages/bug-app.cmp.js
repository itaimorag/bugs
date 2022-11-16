
import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'

import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
       
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <button @click="createPdf">Create PDF</button>
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <h2>Total Pages {{totalPages}}</h2>
        <button @click="setPage(-1)">Prev</button>
            <button @click="setPage(1)">Next</button>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        description:'',
        severity:false,
        page: 0,
      },
      totalPages: 0,
    }

  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.totalPages = totalPages 
        this.bugs = filteredBugs
      })
    },
    createPdf(){
      bugService.makePdf()
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page=0 }
      this.loadBugs() 
    },
    removeBug(bugId) {
      bugService.remove(bugId)
      .then(() => this.loadBugs())
      .catch(err => {
        eventBus.emit('show-msg', { txt: 'Error, please try again later', type: 'error' })
    })
    },
    setPage(dir) {
      this.filterBy.page += +dir
      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    },
    logout(){
      userService.logout()
            .then(() => {
                eventBus.emit('show-msg', { txt: 'User logged out succesfully', type: 'success' })
                // this.$router.push('/bug')
            })
            .catch(err => {
                eventBus.emit('show-msg', { txt: 'Error, please try again later', type: 'error' })
            })
    }
  },
  computed: {
    // bugsToDisplay() {
    //   if (!this.filterBy?.title) return this.bugs
    //   return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    // },
  },
  components: {
    bugList,
    bugFilter,
    // pdfService
  },
}
