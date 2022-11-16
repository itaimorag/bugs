import { userService } from "../services/user-service.js"

export default {
  template: `
       <section class="user-list">
<ul v-for="user in users" :user="user" :key="user._id">
<li>
    
    {{ user.fullname }}
    <button v-if="userHasBugs">x</button>
</li>
</ul>
       </section>
    `,
     data() {
        return {
            users: null,
            user:null,
        }
    },
    created(){
this.addUsers()
    },
    methods: {
        addUsers(){
            userService.getUsers().then((users) => {
                this.users = users 
                console.log(`this.userBugs = `,this.users )
              })
            
        }
    },
    computed: {
        getuserName(user){
            console.log(`user = `, user)
return user.fullname
        },
        userHasBugs(){
            userService.getUserBugs(this.user).then(({ totalPages, filteredBugs }) => {
                console.log(`this.user = `, this.user)
                console.log(`filteredBugs = `, filteredBugs)
                if(filteredBugs.length>0) return false
                return true
            })
        }
    },
    components: {
      
    }
}
