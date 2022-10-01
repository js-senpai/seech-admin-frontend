<template>
  <div v-if="show" class="create-request-modal">
    <div class="create-request-modal__container">
      <header class="create-request-modal__header">
        <h4 class="create-request-modal__title">{{ $t('createRequestModal.title') }}</h4>
        <button type="button" class="create-request-modal__btn-close" @click="show = !show">
          <font-awesome-icon :icon="['fas','xmark']" />
        </button>
      </header>
      <div class="create-request-modal__body">
        <BFormGroup  :label="$t('createRequestModal.type')" class="mb-4">
          <v-select v-model="type" :options="typeOptions" />
        </BFormGroup>
        <BFormGroup  :label="$t('createRequestModal.subtype')" class="mb-4">
          <v-select v-model="subtype" :options="subtypeOptions" :disabled="!type"  />
        </BFormGroup>
        <BFormGroup  :label="$t('createRequestModal.weight')" class="mb-4">
          <RangeInput :min="1" :max="5000" :value.sync="weight" />
        </BFormGroup>
        <BFormGroup v-if="enablePrice"  :label="$t('createRequestModal.price')" class="mb-4">
          <RangeInput :min="1" :max="5000" :value.sync="price" />
        </BFormGroup>
        <BFormGroup   :label="$t('createRequestModal.description')" class="mb-4">
          <b-form-textarea v-model="description" />
        </BFormGroup>
        <UploadFile v-if="enablePhoto" class="mb-4" :file-url.sync="photoUrl" />
        <button  class="mb-1 create-request-modal__btn create-request-modal__btn-accept" @click="saveChanges()">{{$t('buttons.accept')}}</button>
        <button class="create-request-modal__btn create-request-modal__btn-cancel" @click="resetModal()">{{$t('buttons.clear')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    UploadFile: () => import("@/components/Ui/UploadFile/UploadFile"),
    RangeInput: () => import("@/components/Ui/RangeInput/RangeInput")
  },
  props: {
    showModal: {
      required: true,
      type: Boolean,
      default: true
    },
    applyModal: {
      required: true,
      type: Function,
      default: () => {}
    },
    resetModal: {
      required: true,
      type: Function,
      default: () => {}
    },
    enablePrice: {
      type: Boolean,
      default: true,
      required: false,
    },
    enablePhoto: {
      type: Boolean,
      default: true,
      required: false,
    }
  },
  data: () => ({
    type: '',
    subtype: '',
    price: 25,
    weight: 25,
    description: '',
    photoUrl: ''
  }),
  computed: {
    show: {
      get () {
        return this.showModal;
      },
      set (value) {
        this.$emit('update:showModal', value);
      }
    },
    typeOptions(){
      return Object.entries(this.$i18n.t('types')).map(([key,data]) => ({
        label: data,
        code: key
      }))
    },
    subtypeOptions(){
      return Object.entries(this.$i18n.t('types')).filter(([_,value]) => this.type.label === value).flatMap(([name]) => Object.entries(this.$i18n.t(`subtypes.${name}List`)).flatMap(([key,data]) => ({
        label: data,
        code: key
      })))
    },
  },
  methods: {
    saveChanges(){
      this.applyModal({
        type: this.type.label,
        typeCode: this.type.code,
        subtype: this.subtype.label,
        subtypeCode: this.subtype.code,
        price: this.price,
        weight: this.weight,
        description: this.description,
        photoUrl: this.photoUrl
      })
      this.show = false;
      this.type = '';
      this.subtype = '';
      this.price = 25;
      this.weight = 25;
      this.description = '';
      this.photoUrl = '';
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
