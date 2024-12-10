<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import type { Card } from '@/stores/userStore'

// icons
// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

export default defineComponent({
  name: 'DashboardCard',
  components: {
    SvgIcon,
  },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true,
    },
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    exists: {
      type: Boolean,
      required: true,
    },
    chipIcon: {
      type: String,
      default: '',
    },
    plusIcon: {
      type: String,
      default: '',
    },
  },
  computed: {
    formattedExpiryDate(): string {
      if (this.card?.expiry_date) {
        const dateArray: string[] = this.card.expiry_date
          ? this.card.expiry_date.split('-').slice(0, 2)
          : []
        return dateArray.reverse().join('/')
      } else {
        return ''
      }
    },
  },
})
</script>

<template>
  <div class="card">
    <div class="container" v-if="exists">
      <div class="chip-container">
        <SvgIcon type="mdi" :path="chipIcon" :size="60" :viewbox="'2 8 24 16'" class="chip" />
      </div>
      <span class="expiry"> {{ formattedExpiryDate }} </span>
      <span class="number" v-if="card?.number">
        44{{ card.number.slice(0, 2) }} {{ card.number.slice(2, 6) }}
      </span>
      <div class="bottom-row">
        <span class="holder">{{ f_name }} {{ l_name }}</span>
        <span>mvBank</span>
      </div>
    </div>
    <div class="container skeleton" v-else>
      <span class="expiry">00/0000</span>
      <span class="number">**** ****</span>
      <div class="bottom-row">
        <span class="holder">YOUR NAME</span>
        <span>mvBank</span>
      </div>
    </div>
    <button><SvgIcon type="mdi" :path="plusIcon" :size="50" /></button>
  </div>
</template>
