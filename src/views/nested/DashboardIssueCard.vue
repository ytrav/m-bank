<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { defineComponent } from 'vue'
import axios, { AxiosError, type AxiosResponse } from 'axios'

// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCreditCardOutline, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

import AppWarning from '@/components/AppWarning.vue'

interface CardResponse {
  number: string
  expiry_date: string
  mbv: string
}

export default defineComponent({
  name: 'DashboardIssueCard',
  components: {
    SvgIcon,
    AppWarning,
  },
  props: {
    closeIcon: {
      type: String,
      required: true,
    },
  },
  data(): {
    error: string
    showMbv: boolean
    userStore: ReturnType<typeof useUserStore>
    icons: {
      mdiCreditCardOutline: string
      mdiEyeOutline: string
      mdiEyeOffOutline: string
    }
    newCard: CardResponse | null
  } {
    return {
      error: '',
      showMbv: false,
      userStore: useUserStore(),
      icons: {
        mdiCreditCardOutline,
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      newCard: null,
    }
  },
  computed: {
    getEyeIcon(): 'mdiEyeOutline' | 'mdiEyeOffOutline' {
      return this.showMbv ? 'mdiEyeOffOutline' : 'mdiEyeOutline'
    },
  },
  methods: {
    issueCard(): void {
      axios
        .post(
          'https://bank-api.maevetopia.fun/issue-card',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.userStore.accessToken}`,
            },
            withCredentials: true,
          },
        )
        .then((cardResponse: AxiosResponse<{ card: CardResponse }>) => {
          // const cardResponse = response
          this.newCard = cardResponse.data.card
          this.userStore.refreshData()
        })
        .catch((error: AxiosError) => {
          this.error = 'An error occurred while issuing the card'
          console.error(error)
        })
    },
  },
})
</script>

<template>
  <div class="card-issue">
    <div class="wrapper">
      <div class="top-bar">
        <h2>Issue a new card</h2>
        <button
          @click="$router.back()"
          v-wave="{
            duration: 0.2,
            color: 'currentColor',
            initialOpacity: 0.2,
            easing: 'ease-out',
          }"
        >
          <SvgIcon type="mdi" :path="closeIcon" :size="24" class="close" />
        </button>
      </div>
      <div class="body" v-if="!newCard">
        <div class="text-wrapper">
          <AppWarning
            class="error"
            v-if="error"
            :warning="{
              type: 'other',
              message: error,
              outline: false,
            }"
          />
          <p>
            As a Maevetopian Citizen and a customer of mvBank, you are entitled to a free debit card
            that you will be able to use for payments for services in the network, as we continue to
            set up and expand it.
          </p>
          <p>
            Only one valid card can be issued per customer, as of the current policy by the Bank of
            Maevetopia. This will likely be changed as we introduce more ways to use your card.
          </p>
          <AppWarning
            :warning="{
              type: 'question',
              message:
                '<strong>How does this work?</strong><br><br>After you request the card, we will immediately issue one, and you will be able to see the card number, expiration date and the 4-digit MBV code. <strong>Be careful as we do not store the MBV code anywhere</strong> and it will be deleted right after showing it to you. <strong>Make sure to remember it or write it down somewhere safe.</strong><br><br>Cards issued under current policy are <strong>valid for 1 year from the issue date</strong>. For exact details, please refer to our <strong>FAQ section</strong>',
              outline: true,
            }"
          />
        </div>
        <div class="bottom">
          <button
            v-if="!userStore.user?.card.number"
            @click="issueCard"
            v-wave="{
              duration: 0.2,
              color: 'currentColor',
              initialOpacity: 0.2,
              easing: 'ease-out',
            }"
          >
            <SvgIcon type="mdi" :path="icons.mdiCreditCardOutline" /> Issue card
          </button>
          <AppWarning
            class="error"
            v-else
            :warning="{
              type: 'other',
              message:
                'You are already in possession of a valid debit card. If you have lost or forgotten the MBV code, please contact us to reset it.',
              outline: false,
            }"
          />
        </div>
      </div>
      <div class="body card-details" v-else>
        <div class="text-wrapper">
          <p>Your new card has been issued successfully! Here are the details:</p>
          <p class="paragraph">
            Card number: <span class="card-value">{{ newCard.number }}</span>
          </p>
          <p class="paragraph">
            Expiration date:
            <span class="card-value">{{ newCard.expiry_date.padStart(7, '0') }}</span>
          </p>
          <p class="paragraph">
            MBV code: <span class="card-value" v-if="showMbv">{{ newCard.mbv }}</span>
            <span v-else class="card-value hidden">****</span>
            <button
              @click="showMbv = !showMbv"
              v-wave="{
                duration: 0.2,
                color: 'currentColor',
                initialOpacity: 0.2,
                easing: 'ease-out',
              }"
            >
              <SvgIcon type="mdi" :path="icons[getEyeIcon]" />
            </button>
          </p>
          <AppWarning
            class="warn"
            :warning="{
              type: 'alert',
              message:
                'Please make sure to write down the MBV code somewhere safe or remember it, as it will be unrecoverable after you leave this screen.',
              outline: true,
            }"
          />
        </div>
        <div class="bottom">
          <button @click="$router.replace('/dashboard')">Proceed</button>
        </div>
      </div>
    </div>
  </div>
</template>
