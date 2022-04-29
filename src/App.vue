<template>
  <div class="shadow-sm bg-light">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <a
          class="navbar-brand"
          @click.prevent="onClickLink"
          href="/"
          title="Home"
        >
          <img src="./assets/hoaxify.png" width="60" alt="Hoaxify Logo" />
          Hoaxify</a
        >
        <ul class="navbar-nav ml-auto">
          <a class="nav-link" @click.prevent="onClickLink" href="/signup">
            {{ $t("signUp") }}
          </a>
          <a class="nav-link" @click.prevent="onClickLink" href="/login">
            Login
          </a>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container">
    <HomePage v-if="path === '/'" />
    <SignUpPage v-else-if="path === '/signup'" />
    <LoginPage v-else-if="path === '/login'" />
    <UserPage v-else-if="path.startsWith('/user/')" />
    <LanguageSelector />
  </div>
</template>

<script>
import SignUpPage from "./pages/SignUpPage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import UserPage from "./pages/UserPage.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
export default {
  name: "App",
  components: {
    SignUpPage,
    LanguageSelector,
    HomePage,
    LoginPage,
    UserPage,
  },

  data() {
    return {
      path: window.location.pathname,
    };
  },

  methods: {
    onClickLink(event) {
      this.path = event.currentTarget.attributes.href.value;
      window.history.pushState({}, "", this.path);
    },
  },

  /* As the computed property cannot be changed directly we will use the data property and custom method to update the state
  computed: {
    path(){
      return window.location.pathname;
    }
  }
*/

  // data(){
  //   return {
  //     path: window.location.hash
  //   }
  // },
  // mounted(){
  //   window.addEventListener("hashchange", () => {
  //     this.path = window.location.hash
  //   });
  // }
};
</script>

