<template>
   <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card light class="elevation-12">
              <v-layout align-center justify-center>
              <img src="@/assets/parrot.svg" aspect-ratio="1.7"/>
              </v-layout>
              <v-card-text>
                <v-form>
                  <v-text-field :color="themeColor" prepend-icon="person" name="login" label="Nickname" type="text"
                  v-model="nickName"></v-text-field>
                  <v-select :color="themeColor" prepend-icon="color_lens" :items="items" label="Theme"
                  v-model="themeColor"></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark @click="enter()" :color="themeColor">Enter Chat</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      items: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 
      'light-blue', 'cyan', 'teal', 'green', 'light-green', 'amber', 'orange', 'deep-orange'
      ],
      themeColor: 'blue',
      nickName: '',
      
    }),
    methods: {
        enter(){
          this.$router.push({name: 'chat', params: {nick: this.nickName, color: this.themeColor}})
           
        }
    },
  }
</script>