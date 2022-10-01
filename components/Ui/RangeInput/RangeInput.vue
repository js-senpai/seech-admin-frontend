<template>
  <div class="range-input">
    <button type="button" class="range-input__btn range-input__btn-minus" @click="subtract">
      <font-awesome-icon :icon="['fas','minus']" />
    </button>
    <input type="text" :min="min" :max="max" class="range-input__input" :value="inputValue" />
    <button type="button" class="range-input__btn range-input__btn-plus" @click="add">
      <font-awesome-icon :icon="['fas','plus']" />
    </button>
  </div>
</template>
<script>
export default {
  props: {
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
        console.log('i here')
        this.inputValue = this.inputValue + 1;
      }
    },
    subtract(){
      if(this.inputValue > this.min){
        this.inputValue = this.inputValue - 1;
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
