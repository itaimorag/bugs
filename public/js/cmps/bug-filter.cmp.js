'use strict'

export default {
  template: `
        <section class="bug-filter">
          <div>
            <label>Filter by title: 
              <input @input="setFilterBy" type="text" v-model="filterBy.title">
            </label>
          </div>
          <div>
            <label>Filter by description: 
              <input @input="setFilterBy" type="text" v-model="filterBy.description">
            </label>
          </div>
          <div>
            <label>Sort by severity: 
              <input @change="setFilterBy" type="checkbox" v-model="filterBy.severity">
            </label>
          </div>
        </section>
    `,
  data() {
    return {
      filterBy: {
        title: '',
        description:'',
        severity:false,
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}
