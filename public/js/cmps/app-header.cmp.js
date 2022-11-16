

import { userService } from "../services/user-service.js"
import loginSignup from "./login-signup.cmp.js"

export default {
  template: `
        <header>
            <h1>Miss Bug</h1>    
            <section v-if="user">
            <p>Welcome {{user.fullname}}</p>
            <router-link to="/user/details">User Details</router-link>
            <router-link v-if="isAdmin" to="/user/list">User List</router-link>
            <button @click="logout">Logout</button>
       </section>
       <section v-else>
       <!-- <router-link to="/login">Login here!</router-link>  -->
            <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
       </section>
        </header>
    `,
     data() {
        return {
            user: userService.getLoggedInUser(),
            isAdmin:false
        }
    },
    created(){
            userService.getFullUser()
            .then((user) => {
                console.log(`user = `, user)
               this.isAdmin = user.isAdmin
            })
    },
    methods: {
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
            userService.getFullUser()
            .then((user) => {
                console.log(`user = `, user)
               this.isAdmin = user.isAdmin
            })
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                })
        }
    },
    computed: {

    },
    components: {
        loginSignup
    }
}
