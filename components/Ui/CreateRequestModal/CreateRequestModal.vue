<template>
  <div v-if="show" class="create-request-modal">
    <div class="create-request-modal__container">
      <header class="create-request-modal__header">
        <h4 class="create-request-modal__title">{{ $t('createRequestModal.title') }}</h4>
        <button type="button" class="create-request-modal__btn-close" @click="closeModal()">
          <font-awesome-icon :icon="['fas','xmark']" />
        </button>
      </header>
      <div class="create-request-modal__body">
        <ValidationObserver v-slot="{ valid }" ref="observer">
          <form @submit.prevent="saveChanges">
          <BFormGroup  :label="$t('createRequestModal.type')" class="mb-4">
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required"
              :name="$t('createRequestModal.type')"
            >
              <v-select v-model="type" :class="classes" :options="typeOptions" @option:selected="onSelectType()" />
              <span class="text-danger mt-1">{{ errors[0] }}</span>
            </ValidationProvider>
          </BFormGroup>
          <BFormGroup  :label="$t('createRequestModal.subtype')" class="mb-4">
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required"
              :name="$t('createRequestModal.subtype')"
            >
              <v-select v-model="subtype" :class="classes" :options="subtypeOptions" :disabled="!type" @option:selected="onSelectSubtype()" />
              <span class="text-danger mt-1">{{ errors[0] }}</span>
            </ValidationProvider>
          </BFormGroup>
          <BFormGroup  :label="$t('createRequestModal.weight')" class="mb-4">
            <div class="d-flex align-items-center">
              <RangeInput :disabled="!subtype" :min="minWeight" :float="isTonWeight" :value.sync="weight" />
              <div class="ml-2">{{$t(`units.${weightType}`)}}</div>
            </div>
          </BFormGroup>
          <BFormGroup v-if="enablePrice"  :label="priceTitle" class="mb-4">
            <div class="d-flex align-items-center">
              <RangeInput :disabled="!subtype" :min="1" :value.sync="price" />
              <div class="ml-2">{{$t(`units.currency`)}}</div>
            </div>
          </BFormGroup>
          <BFormGroup   :label="$t('createRequestModal.description')" class="mb-4">
            <b-form-textarea v-model="description" />
          </BFormGroup>
          <UploadFile v-if="enablePhoto" class="mb-4" :file-url.sync="photoUrl" />
          <button type="submit" :disabled="!valid"  class="mb-1 create-request-modal__btn create-request-modal__btn-accept">{{$t('buttons.accept')}}</button>
          <button type="button" class="create-request-modal__btn create-request-modal__btn-cancel" @click="closeModal()">{{$t('buttons.clear')}}</button>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    UploadFile: () => import("@/components/Ui/UploadFile/UploadFile"),
    RangeInput: () => import("@/components/Ui/RangeInput/RangeInput"),
    ValidationObserver: () => import('vee-validate').then(module => module.ValidationObserver),
    ValidationProvider: () => import('vee-validate').then(module => module.ValidationProvider)
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
    price: 1,
    weight: 1,
    description: '',
    photoUrl: '',
    priceTitle: '',
    weightType: 'kilogram',
    minWeight: 1
  }),
  computed: {
    isTonWeight(){
      return this.weightType === 'weightTon';
    },
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
      return this.type ? Object.entries(this.$i18n.t('types')).filter(([_,value]) => this.type.label === value).flatMap(([name]) => Object.entries(this.$i18n.t(`subtypes.${name}List`)).flatMap(([key,data]) => ({
        label: data,
        code: key
      }))): []
    },
  },
  mounted() {
    this.priceTitle = this.$i18n.t('createRequestModal.price',{
      weightType: this.$i18n.t('units.kilogram')
    })
  },
  methods: {
    custom() {
      return { on: ['search:blur', 'input'] };
    },
    onSelectType() {
      this.subtype = '';
    },
    onSelectSubtype(){
      const cultureWithLiters = ['honey', 'milk', 'sourCream'];
      const cultureWithTon = ['wheat', 'barley', 'corn', 'buckwheat', 'soy'];
      if (
        cultureWithLiters.includes(this.subtype.code) ||
        cultureWithLiters.includes(this.type.code)
      ) {
        this.weightType = 'liter';
        this.minWeight = 1;
        this.weight = 1;
      } else if (
        cultureWithTon.includes(this.subtype.code) ||
        cultureWithTon.includes(this.type.code)
      ) {
       this.weightType = 'weightTon';
       this.minWeight = .1;
       this.weight = .1;
      } else if (this.subtype.code === 'egg') {
        this.weightType = 'amount';
        this.minWeight = 1;
        this.weight = 1;
      } else {
        this.weightType = 'kilogram';
        this.minWeight = 1;
        this.weight = 1;
      }
      this.priceTitle = this.$i18n.t('createRequestModal.price',{
        weightType: this.$i18n.t(`units.${this.weightType}`)
      })
    },
    closeModal() {
      this.show = false;
      this.type = '';
      this.subtype = '';
      this.price = 25;
      this.weight = 25;
      this.description = '';
      this.photoUrl = '';
      this.priceTitle =  '';
      this.weightType =  'kilogram';
      this.minWeight =  1;
      this.resetModal();
    },
    saveChanges(){
      this.applyModal({
        type: this.type.label,
        typeCode: this.type.code,
        subtype: this.subtype.label,
        subtypeCode: this.subtype.code,
        price: this.price,
        weight: this.weight,
        ...(this.description && {
          description: this.description
        }),
        ...(this.photoUrl && {
          photoUrl: this.photoUrl
        })
      })
      this.show = false;
      this.type = '';
      this.subtype = '';
      this.price = 25;
      this.weight = 25;
      this.description = '';
      this.photoUrl = '';
      this.priceTitle =  '';
      this.weightType =  'kilogram';
      this.minWeight =  1;
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
