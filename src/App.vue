<template>
  <div class="shadow-sm bg-light">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <router-link
          class="navbar-brand"
          to="/"
          title="Home"
        >
          <img src="./assets/hoaxify.png" width="60" alt="Hoaxify Logo" />
          Hoaxify</router-link
        >
        <ul class="navbar-nav ml-auto">
          <router-link class="nav-link" to="/signup">
            {{ $t("signUp") }}
          </router-link>
          <router-link class="nav-link" to="/login">
            Login
          </router-link>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container">
    <router-view />
    <LanguageSelector />
  </div>
</template>

<script>
import LanguageSelector from "./components/LanguageSelector.vue";
export default {
  name: "App",
  components: {
    LanguageSelector
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

