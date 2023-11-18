<template>
  <div class="grid" :style="{ width: `${width * gridPointDistance}px`, height: `${height * gridPointDistance}px` }">
    <img v-for="(ship, index) in ships" :id="'ship' + index" class="ship" src="public/images/ship.svg" :style="{ bottom: `${ship.y * gridPointDistance}px`, left: `${ship.x * gridPointDistance}px` }">
  </div>
</template>

<script lang="ts">
import {onUpdated} from "vue";
import ProcessCommands from "@/mixins/ProcessCommands.vue";
import Constants from "@/mixins/Constants.vue";
import {Coordinates, Orientation, ProcessedInstructions, Ship} from "@/interfaces";

export default {
  name: "Ship",
  mixins: [ProcessCommands, Constants],
  props: {
    instructions: {
      type: Object as () => ProcessedInstructions,
    },
  },
  data(): {
    width: number,
    height: number,
    gridPoints: Coordinates[],
    ships: Ship[],
    warnings: Coordinates[],
    shipX: number,
    shipY: number,
    orientation: Orientation | undefined,
  } {
    return {
      width: 0,
      height: 0,
      gridPoints: [],
      ships: [],
      warnings: [],
      shipX: 0,
      shipY: 0,
      orientation: undefined,
    }
  },
  methods: {
    createGrid(): void {
      // convert to pixels
      this.width = this.instructions.width;
      this.height = this.instructions.height;

      this.ships = this.instructions.ships;
      this.warnings = [];
    },

  },
  mounted() {
    this.createGrid();
    onUpdated(() => {
      this.createGrid();
    });
  }
}

</script>
