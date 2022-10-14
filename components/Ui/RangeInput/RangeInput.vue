<template>
  <div class="range-input">
    <button type="button" class="range-input__btn range-input__btn-minus" @click="subtract">
      <font-awesome-icon :icon="['fas','minus']" />
    </button>
    <input type="number" :min="min" :max="max" class="range-input__input" :value="inputValue" />
    <button type="button" class="range-input__btn range-input__btn-plus" @click="add">
      <font-awesome-icon :icon="['fas','plus']" />
    </button>
  </div>
</template>
<script>
export default {
  props: {
    float: {
      type: Boolean,
      required: false,
      default: false
    },
    value:{
      type: Number,
      required: true,
      default: 0
    },
    min: {
      type: Number,
      required: false,
      default: 0
    },
    max: {
      type: Number,
      required: false,
      default: 100
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('update:value', value);
      }
    },
  },
  methods: {
    add(){
      if(this.inputValue < this.max){
        this.inputValue = this.float ? +(+this.inputValue + .1).toFixed(2): +this.inputValue + 1;
      }
    },
    subtract(){
      if(this.inputValue > this.min){
        this.inputValue = this.float ? +(+this.inputValue - .1).toFixed(2): +this.inputValue - 1;
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
