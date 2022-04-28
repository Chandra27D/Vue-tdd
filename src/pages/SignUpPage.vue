<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mt-5" data-testid="form-sign-up" v-show="!signupSuccess">
      <div class="card-header">
        <h1 class="text-center">{{ $t("signUp")}}</h1>
        <div class="card-body"></div>
        <UsernameInput 
        id="username" 
        :label="$t('username')" 
        :help="errors.username" 
        v-model="username"
        type="text"
        />
        <UsernameInput 
        id="email" 
        :label="$t('email')" 
        :help="errors.email" 
        v-model="email"
        type="email"
        />
        <UsernameInput 
        id="password" 
        :label="$t('password')" 
        :help="errors.password" 
        v-model="password"
        type="password"
        />
        <UsernameInput 
        id="confirm-password" 
        :label="$t('confirmPassword')" 
        :help="hasPasswordMismatch ? $t('passwordMismatchValidation') : ''" 
        v-model="confirmPassword"
        type="password"
        />
        <!-- <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input id="username" v-model="username" class="form-control" />
          <span> {{ errors.username }} </span>
        </div> -->
        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit"
          >
            <span
              v-if="apiProgress"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            {{ $t("signUp")}}
          </button>
          <!-- This has better performance -->
        </div>
      </div>
      <!-- Taking input using v-on directive does not work when an active user is already logged in. Use v-model directive instead.
            <label for="password">Password</label>
            <input 
            id="password" 
            type="password" 
            @input="(event) => password = event.target.value"
            />
            
            <label for="confirm-password">Confirm Password</label>
            <input 
            id="confirm-password" 
            type="password" 
            @input="(event) => confirmPassword = event.target.value"
            /> 
            -->

      <!-- <button :disabled="isDisabled()">Sign Up</button> -->
    </form>
    <div class="alert alert-success mt-3" v-show="signupSuccess">
      {{$t('accountActivationNotification')}}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UsernameInput from '../components/UsernameInput.vue'
export default {
  name: "SignUpPage",
  components: {
      UsernameInput
  },
  data() {
    return {
      // isDisabled: true, to refactor the code we need a more readable and clean format and that's what we have done.
    //   disabled: false, use apiProgress as it is serving the same purpose
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      apiProgress: false,
      signupSuccess: false,
      errors: {},
    };
  },
  /*
    methods: {
        onChangePassword(event){
            this.password = event.target.value;
        },

        onChangeConfirmPassword(event){
            this.confirmPassword = event.target.value;
        }, use the inline function instead of defining it here.

        isDisabled(){
            return this.password && this.confirmPassword 
                ? this.password !== this.confirmPassword 
                : true;            
        }, If you use this method and if you listen to the events for other fields as well then isDisabled will get updated even though it is not relate to those fields. That's why it is safe to use the computed properties rather than the methods.
    },
    */

  computed: {
    isDisabled() {
      return this.password && this.confirmPassword
        ? this.password !== this.confirmPassword
        : true;
    },
    hasPasswordMismatch(){
        return this.password !== this.confirmPassword
    },
  },

  watch: {
      username(){
          delete this.errors.username;
      },
      email(){
          delete this.errors.email;
      },
      password(){
          delete this.errors.password;
      }
  },

  methods: {
    submit() {
      this.disabled = true;
      this.apiProgress = true;
      // axios.post('http://localhost:8080/api/1.0/users', { we set the target as http://localhost:8080 for all the /api requests in the vue.config,js file.
      axios
        .post("/api/1.0/users", {
          username: this.username,
          email: this.email,
          password: this.password,
        }, {
          headers: {
            "Accept-Language": this.$i18n.locale
          }
        })
        .then(() => (this.signupSuccess = true))
        .catch((error) => {
            if(error.response.status === 400){
                this.errors = error.response.data.validationErrors
            }
            this.apiProgress = false;
        })

      /*
            const requestBody = {
                username: this.username,
                email: this.email,
                password: this.password,
            }
            
            fetch('/api/1.0/users', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            */
    },

    // onChangeUsername(event){
    //     this.username = event.target.value
    // }

    /* This is a way to prevent the defaualt behaviour of the browser, however, Vue provides the modifiers that can be used directly at the event handlers.
        submit(event){
            event.preventDefault();
            axios.post('/api/1.0/users', {
                username: this.username,
                email: this.email,
                password: this.password,
            });
        } */
  },
};
</script>

