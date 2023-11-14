<template>
  <form @submit.prevent>
    <textarea class="form-control"
              rows="10" cols="50"
              v-model="instructions"
              placeholder="Instructions"
    ></textarea>
    <p>{{instructions}}</p>
    <button class="btn btn-primary" type="submit" @click="handleInput">Submit</button>
  </form>
</template>

<script lang="ts">
import ProcessRawInstructions from '@/mixins/ProcessRawInstructions.vue';
export default {
  name: "Form",
  mixins: [ProcessRawInstructions],
  data() {
    return {
      instructions: '5 3\n' +
          '1 1 E\n' +
          'RFRFRFRF\n' +
          '\n' +
          '3 2 N\n' +
          'FRRFLLFFRRFLL\n' +
          '\n' +
          '0 3 W\n' +
          'LLFFFLFLFL',
    };
  },
  methods: {
    handleInput(): void {
      console.log(this.instructions)
      const instructionsObj = this.rawToObj(this.instructions);
      console.log(instructionsObj)
    },
  }
}
</script>
<style scoped>

</style>