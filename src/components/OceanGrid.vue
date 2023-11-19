<template>
  <div class="grid">
    <svg :viewBox="'0 0 ' + (width + offset) + ' ' + (height + offset )" xmlns="http://www.w3.org/2000/svg">
      <line v-for="point in gridPoints"  :x1="offset/2" :y1="point.y + offset/2" :x2="width + offset/2" :y2="point.y + offset/2" :strokeWidth="strokeWidth" stroke="#12a612" stroke-dasharray="4" />

      <line v-for="point in gridPoints"  :x1="point.x + offset/2" :y1="offset/2" :x2="point.x + offset/2" :y2="height + offset/2" :strokeWidth="strokeWidth" stroke="#12a612" stroke-dasharray="4" />

      <circle v-for="point in gridPoints" :cx="point.x + offset/2" :cy="point.y + offset/2" :r="circleRadius" fill="#12a612" />

      <foreignObject :x="0" :y="0" :width="width + offset" :height="height + offset">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <Ship :instructions="instructions" :offset="offset" />
        </div>
        </foreignObject>
    </svg>
  </div>
</template>

<script lang="ts">
import {onUpdated} from "vue";
import Ship from "@/components/Ship.vue";
import {Coordinates, ProcessedInstructions} from "@/interfaces";

export default {
  name: "OceanGrid",
  components: {Ship},
  props: {
    instructions: {
      type: Object as () => ProcessedInstructions,
    },
  },
  data(): {
    width: number,
    height: number,
    strokeWidth: number,
    circleRadius: number,
    gridPointDistance: number,
    gridPoints: Coordinates[],
  } {
    return {
      width: 0,
      height: 0,
      strokeWidth: 0.4,
      circleRadius: 5,
      gridPointDistance: 75,
      gridPoints: [],
    }
  },
  computed: {
    offset(): number {
      // resize ship for better visibility
      if(this.instructions.width > 10) return 50;
      if(this.instructions.width > 25) return 100;
      return 30;
    },
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
