<template>
  <div data-testid="activation-page">
    <div class="alert alert-success mt-3 " v-if="success">Account is activated</div>
  </div>
</template>

<script>
import { activate } from "../api/apiCalls";
export default {
  data() {
    return {
      success: false,
    };
  },
  mounted() {
    activate(this.$route.params.token).then(() => (this.success = true));
  },
};
</script>