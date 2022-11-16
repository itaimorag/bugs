import { userService } from "../services/user-service.js"

import bugList from '../cmps/bug-list.cmp.js'

export default {
  template: `
  <section>
   
<router-link to="/bug">To Bugs Page</router-link> 
<bug-list v-if="userBugs" :bugs="getUserBugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
      return {
        user: userService.getLoggedInUser(),
        userBugs:''
    }

  },
  created(){
    userService.getUserBugs().then(({ totalPages, filteredBugs }) => {
      this.totalPages = totalPages 
      this.userBugs = {filteredBugs}
      console.log(`this.userBugs = `,this.userBugs )
    })


  },
  methods: {
   
  },
  computed: {
    getUserBugs(){
      console.log(`this.userBugs = `, this.userBugs)
      return this.userBugs


    }
  },
  components: {
    bugList
  },
}
