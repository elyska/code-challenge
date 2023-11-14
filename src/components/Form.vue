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
    <p v-if="errorMessage" class="alert alert-warning mt-4" role="alert">
      {{ errorMessage }}
    </p>
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
  data(): {
    instructions: string;
    output: string[];
    errorMessage: string;
  } {
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
      errorMessage: "",
    };
  },
  methods: {
    handleInput(): void {
      this.errorMessage = "";
      try {

        const instructionsObj: ProcessedInstructions = this.rawToObj(this.instructions);
        const output: string[] = this.carryOutInstructions(instructionsObj);
        this.output = output;
      }
      catch (message) {
        this.errorMessage = message;
      }
    },
  }
}
</script>
<style scoped>

</style>