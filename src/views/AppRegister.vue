<script lang="ts">
import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useUserStore, type Gender, type User } from '@/stores/userStore'
import { defineComponent } from 'vue'

import AppWarning from '@/components/AppWarning.vue'

export interface RegisterData {
  inviteCode: string
  password: string
  f_name: string
  l_name: string
  gender: Gender
  remember: boolean
}

// icons
// // @ts-expect-error - icon import has type any
// import SvgIcon from '@jamescoyle/vue-icon'

export default defineComponent({
  components: {
    AppWarning,
  },
  data(): {
    error: string
    registerData: RegisterData
    userStore: ReturnType<typeof useUserStore>
    registerFields: Array<{
      label: string
      type: string
      name: string
      autocomplete: string
      autocapitalize?: string
      model: keyof RegisterData
      length: string
    }>
    genderOptions: Array<{
      value: string
      text: string
    }>
  } {
    return {
      error: '',
      registerData: {
        inviteCode: '',
        password: '',
        f_name: '',
        l_name: '',
        gender: '',
        remember: false,
      },
      userStore: useUserStore(),
      registerFields: [
        {
          label: 'First name',
          type: 'text',
          name: 'f_name',
          autocomplete: 'given-name',
          autocapitalize: 'words',
          model: 'f_name',
          length: '20',
        },
        {
          label: 'Last name',
          type: 'text',
          name: 'l_name',
          autocomplete: 'family-name',
          autocapitalize: 'words',
          model: 'l_name',
          length: '20',
        },
        {
          label: 'Invite code',
          type: 'text',
          name: 'inviteCode',
          autocomplete: 'off',
          model: 'inviteCode',
          length: '36',
        },
        {
          label: 'Password',
          type: 'password',
          name: 'password',
          autocomplete: 'new-password',
          model: 'password',
          length: '255',
        },
      ],
      genderOptions: [
        {
          value: 'm',
          text: 'Male (he/him, Mr.)',
        },
        {
          value: 'f',
          text: 'Female (she/her, Ms.)',
        },
        {
          value: 'n',
          text: 'Non-binary (they/them, Mx.)',
        },
        {
          value: 'o',
          text: 'Other (they/them, Mx.)',
        },
        {
          value: 'p',
          text: 'Prefer not to say (they/them, Mx.)',
        },
      ],
    }
  },
  computed: {
    passwordCheck(): boolean {
      if (
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~])[A-Za-z\d!@#$%^&*()\-_=+$begin:math:display$$end:math:display${}|;:'",.<>?/`~]{8,}$/.test(
          this.registerData.password,
        )
      ) {
        return true
      }
      return false
    },
  },
  methods: {
    register(): void {
      axios
        .post(
          'https://bank-api.maevetopia.fun/register',
          {
            f_name: this.registerData.f_name,
            l_name: this.registerData.l_name,
            gender: this.registerData.gender,
            inviteCode: this.registerData.inviteCode,
            password: this.registerData.password,
            remember: this.registerData.remember,
          },
          {
            withCredentials: true,
          },
        )
        .then((userResponse: AxiosResponse<{ user: User }>) => {
          console.log('Register response', userResponse)
          this.userStore.setLoggedIn(true)
          this.userStore.setUserData(userResponse.data.user)
          this.$router.replace('/dashboard/welcome')
        })
        .catch((error: AxiosError<{ error: string }>) => {
          console.error('Register error', error)
          this.error = error.response?.data?.error || error.message || 'Unexpected error occurred'
        })
    },
  },
  watch: {
    'registerData.f_name': function (val) {
      this.registerData.f_name = val.charAt(0).toUpperCase() + val.slice(1)
    },
    'registerData.l_name': function (val) {
      this.registerData.l_name = val.charAt(0).toUpperCase() + val.slice(1)
    },
  },
})
</script>

<template>
  <div class="register">
    <h2>Become an Account holder</h2>
    <AppWarning
      class="error"
      v-if="error"
      :warning="{
        type: 'other',
        message: error,
        outline: false,
      }"
    />
    <span> {{ passwordCheck }} </span>
    <form @submit.prevent="register">
      <div v-for="(field, index) in registerFields" :key="index" class="input-container">
        <input type="text" autocomplete="username" style="display: none" />
        <input
          :id="field.name"
          v-model="registerData[field.model]"
          :type="field.type"
          :maxlength="field.length"
          :placeholder="field.label"
          :autocomplete="field.autocomplete"
          :autocapitalize="field.autocapitalize"
          spellcheck="false"
          required
        />
        <label :for="field.name"> {{ field.label }} </label>
      </div>
      <select required v-model="registerData.gender" name="gender" id="gender-select">
        <option value="" disabled selected>Gender identity</option>
        <option v-for="(option, index) in genderOptions" :key="index" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <div class="remember">
        <input v-model="registerData.remember" type="checkbox" name="remember" id="remember" />
        <label for="remember">Remember me</label>
      </div>
      <button
        v-wave="{
          duration: 0.2,
          color: 'currentColor',
          initialOpacity: 0.2,
          easing: 'ease-out',
        }"
        type="submit"
      >
        Register
      </button>
      <button class="mid-button" type="button" disabled>
        Continue with mID <span>(Coming soon)</span>
      </button>
      <caption>
        Already a member?
        <RouterLink to="/login">Sign in</RouterLink>
      </caption>
    </form>
    <AppWarning
      :warning="{
        type: 'question',
        message:
          '<strong>Why do we need this data?</strong><br><br>This information is used solely to personalise your experience and will not be shared with any third parties.<br>You <strong>do not need</strong>, and are in fact <strong>discouraged from providing your real name or any other personal info</strong>, you may choose whatever set of a given and family name you wish to be referred to as.<br><br>It is, however, <strong>suggested to use the name as per your Maevetopian ID</strong> if you have one.',
        outline: true,
      }"
    />
  </div>
</template>
