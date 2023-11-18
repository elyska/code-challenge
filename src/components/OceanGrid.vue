<template>
  <div class="grid" :style="{ width: `${width}px`, height: `${height}px` }">
    <div class="grid-line-horizontal" v-for="point in gridPoints" :style="{ width: `${width}px`, bottom: `${point.y}px`, left: `0px` }"></div>

    <div class="grid-line-vertical" v-for="point in gridPoints" :style="{ height: `${height}px`, bottom: `0px`, left: `${point.x}px` }"></div>

    <div class="grid-point" v-for="point in gridPoints" :style="{ bottom: `${point.y}px`, left: `${point.x}px` }"></div>

    <Ship :instructions="instructions" />
  </div>
</template>

<script lang="ts">
import {onUpdated} from "vue";
import {Coordinates, ProcessedInstructions} from "@/interfaces";
import Constants from "@/mixins/Constants.vue";
import Ship from "@/components/Ship.vue";

export default {
  name: "OceanGrid",
  components: {Ship},
  mixins: [Constants],
  props: {
    instructions: {
      type: Object as () => ProcessedInstructions,
    },
  },
  data(): {
    width: number,
    height: number,
    gridPoints: Coordinates[],
  } {
    return {
      width: 0,
      height: 0,
      gridPoints: [],
    }
  },
  methods: {
    createGrid(): void {
      const width = this.instructions.width;
      const height = this.instructions.height;

      // convert to pixels
      this.width = width * this.gridPointDistance;
      this.height = height * this.gridPointDistance;

      // create grid point coordinates in pixels
      const points: Coordinates[] = [];
      for (let i = 0; i <= width; i++) {
        const x: number = i * this.gridPointDistance;
        for (let j = 0; j <= height; j++) {
          const y: number = j * this.gridPointDistance;
          points.push({x: x, y: y});
        }
      }
      this.gridPoints = points;
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
