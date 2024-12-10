<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export interface Warning {
  type: 'info' | 'alert' | 'question' | 'other'
  message: string
  outline: boolean
}

// icons
// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

import {
  mdiInformationSlabCircle,
  mdiInformationSlabCircleOutline,
  mdiAlertCircle,
  mdiAlertCircleOutline,
  mdiHelpCircle,
  mdiHelpCircleOutline,
} from '@mdi/js'

// import

export default defineComponent({
  components: {
    SvgIcon,
  },
  data(): {
    icons: {
      info: string
      infoOutline: string
      alert: string
      alertOutline: string
      question: string
      questionOutline: string
    }
  } {
    return {
      icons: {
        info: mdiInformationSlabCircle,
        infoOutline: mdiInformationSlabCircleOutline,
        alert: mdiAlertCircle,
        alertOutline: mdiAlertCircleOutline,
        question: mdiHelpCircle,
        questionOutline: mdiHelpCircleOutline,
      },
    }
  },
  props: {
    warning: {
      type: Object as PropType<Warning>,
      required: true,
    },
  },
  computed: {
    getIcon(): string {
      if (this.warning.type === 'other') {
        return ''
      } else {
        return this.warning.outline
          ? this.icons[`${this.warning.type}Outline`]
          : this.icons[this.warning.type]
      }
    },
    getLabel(): string {
      switch (this.warning.type) {
        case 'info':
          return 'Notice: '
        case 'alert':
          return 'Warning: '
        default:
          return ''
      }
    },
  },
})
</script>

<template>
  <div class="warning" :class="warning.type">
    <SvgIcon v-if="warning.type !== 'other'" type="mdi" :path="getIcon" :size="30" class="icon" />
    <p>
      <span>{{ getLabel }}</span>
      <span v-html="warning.message"></span>
    </p>
  </div>
</template>
