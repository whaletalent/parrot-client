<template>
  <div>
    <v-app dark>
      <v-alert
        class="alert"
        v-show="this.socket.disconnected"
        :value="true"
        :color="responsePServer.alertColor"
      >
        <v-icon class="loop">{{responsePServer.icon}}</v-icon>
        {{responsePServer.msg}}
      </v-alert>
      <v-navigation-drawer v-model="drawer" app v-show="this.socket.connected">
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">Online Users</v-list-tile-title>
          </v-list-tile>
          <v-alert
            class="alert"
            v-show="fechOk == false"
            :value="true"
            :color="responsePUsers.alertColor"
          >
            <v-icon class="loop">{{responsePUsers.icon}}</v-icon>
            {{responsePUsers.msg}}
          </v-alert>
          <v-alert
            v-for="(user, index) of users"
            :key="index"
            :value="true"
            :color="user.color"
          >{{user.nick}}</v-alert>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app :color="this.userColor" v-show="this.socket.connected">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Parrot</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <BreadcrumbItem>
              <v-btn icon href="https://vuetifyjs.com/en/" target="_blank">
                <v-icon v-on="on">fab fa-vuejs</v-icon>
              </v-btn>
            </BreadcrumbItem>
          </template>
          <span>Made With Vuetify</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <BreadcrumbItem>
              <v-btn icon href="https://github.com" target="_blank">
                <v-icon v-on="on">fab fa-github-alt</v-icon>
              </v-btn>
            </BreadcrumbItem>
          </template>
          <span>See code on Github</span>
        </v-tooltip>
        
        <v-avatar>
          <img src="@/assets/parrotIco.svg" alt="ParrotLogo">
        </v-avatar>
      </v-toolbar>
      <v-content>
        <v-container fluid v-show="this.socket.connected" class="messageContainer">
          <div v-for="(msg, index) in messages" :key="index">
            <v-alert :value="true" :color="msg.color">
              <b>{{ msg.user }}</b>
              {{ msg.message }}
            </v-alert>
          </div>
          <br>
          <br>
          <br>
          <br>
          <br>
          <p ref="scroll"></p>
        </v-container>
      </v-content>
      <v-footer color="#303030" inset app v-show="this.socket.connected">
        <v-layout justify-center row wrap>
          <v-flex xs10>
            <v-text-field
              :color="this.userColor"
              v-model="message"
              append-outer-icon="send"
              box
              clear-icon="cancel"
              clearable
              label="Enter your message here"
              type="message"
              @keyup.enter="sendMessage"
              @click:append-outer="sendMessage"
              @click:clear="clearMessage"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>
<script>
import io from "socket.io-client";
export default {
  data: () => ({
    drawer: null,
    responsePServer: {
      msg: "Connecting to Parrot server...",
      alertColor: "blue",
      icon: "loop"
    },
    responsePUsers: {
      msg: "Getting online users",
      alertColor: "blue",
      icon: "loop"
    },
    users: [],
    fechOk: false,
    user: "",
    userColor: "",
    userId: "",
    message: "",
    messages: [],
    socket: io("https://api-parrot.herokuapp.com/")
  }),
  methods: {
    sendMessage(e) {
      e.preventDefault();

      this.socket.emit("SEND_MESSAGE", {
        color: this.userColor,
        user: this.user,
        message: this.message
      });
      this.message = "";
    },
    clearMessage() {
      this.message = "";
    },
    openWindow(link){
      let route = this.$router.resolve({path: link});
      window.open(route.href, '_blank');
      //window.open(link, "_blank");
    },
    getUsersOnline(){
      fetch("https://api-parrot.herokuapp.com/online", {
        method: "get"
      })
        .then(response => response.json())
        .then(usersOnline => {
          this.users = usersOnline;
          this.fechOk = true;
        })
        .catch(err => {
          console.log(err);
          this.responsePUsers.alertColor = "red";
          this.responsePUsers.msg =
            "Error getting online users. Try again later";
          this.responsePUsers.icon = "";
        });
    }
  },
  created() {
    if (this.socket.disconnected) {
      setTimeout(() => {  
        this.responsePServer = {
          msg: "Parrot Server error. Try again later",
          color: "red",
          icon: ""
        };
      }, 5000);
    }
    //socket.emit (this user to server)
    //socket.on (for all users to server)
    this.user = this.$route.params.nick;
    this.userColor = this.$route.params.color;
    this.userId = JSON.stringify(this.socket.id);
    //entered chat listener
    this.socket.emit("CREATED", {
      id: this.userId,
      nick: this.user,
      color: this.userColor
    });
    this.socket.on("CREATED", data => {
      // url (required), options (optional)
      this.getUsersOnline();
    });
    this.socket.on("disconnect", data => {
      this.getUsersOnline();
    });
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm("Do you really want to leave?");
    if (answer) {
      location.reload();
      next();
    } else {
      next(false);
    }
  },
  mounted() {
    this.socket.on("MESSAGE", data => {
      this.messages.push(data);
      //auto Scroll
      this.$refs.scroll.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  }
};
</script>
<style scoped>
.messageContainer {
  display: flex;
  flex-direction: column;
  float: left;
}
.loop {
  animation: loader 1s infinite;
}
.alert {
  vertical-align: middle;
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>