<template>
  <h1>Input</h1>
  <form @submit.prevent>
    <textarea class="form-control"
              rows="10" cols="50"
              v-model="instructions"
              placeholder="Instructions"
    ></textarea>
    <br/>
    <button class="btn btn-primary" type="submit" @click="handleInput">Submit</button>
  </form>
  <br/>
  <p>
    <h1 v-if="output.length > 0">Output</h1>
    <ul>
      <li v-for="line in output">
        {{ line }}
      </li>
    </ul>
  </p>
</template>

<script lang="ts">
import ProcessInstructions from '@/mixins/ProcessInstructions.vue';
import {ProcessedInstructions} from "@/interfaces";
export default {
  name: "Form",
  mixins: [ProcessInstructions],
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
      output: [],
    };
  },
  methods: {
    handleInput(): void {
      const instructionsObj: ProcessedInstructions = this.rawToObj(this.instructions);
      const output: string[] = this.carryOutInstructions(instructionsObj);
      this.output = output;
    },
  }
}
</script>
<style scoped>

</style>