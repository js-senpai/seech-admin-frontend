<template>
  <div class="upload-file">
    <div class="d-flex justify-content-center">
      <div v-show="isLoad" class="spinner-border" role="status" />
    </div>
    <label v-show="!isLoad" class="upload-file__label">
      <input id="img" ref="file" type="file" name="img" accept="image/png, image/jpeg" class="d-none upload-file__input" @change="upload()">
      <b-img-lazy src="~/assets/img/createRequestModal/download.svg" />
      <span v-if="!getFile" class="upload-file__text">{{ $t('buttons.uploadPhoto') }}</span>
      <b-img-lazy v-else class="upload-file__img" :src="getFile" />
    </label>
  </div>
</template>
<script>
export default {
  props: {
    acceptedTypes: {
      type: String,
      required: false,
      default: 'image/png, image/jpeg'
    },
    fileUrl: {
      type: String,
      required: true,
      default: ''
    },
  },
  data: () => ({
    isLoad: false
  }),
  computed: {
    getFile: {
      get () {
        return this.fileUrl;
      },
      set (value) {
        this.$emit('update:fileUrl', value);
      }
    },
  },
  mounted() {
    this.text = this.$i18n.t('buttons.uploadPhoto');
  },
  methods: {
    async upload(){
      this.isLoad = true;
      try {
        const newFile = this.$refs.file.files[0];
        const formData = new FormData();
        formData.append('file', newFile);
        const { data: { url } } = await this.$axios.post(`${this.$config.backendUrl}/ticket-image`, formData);
        this.getFile = url;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false;
      }
    }
  }
}
</script>
<style lang="scss">
  @import "scss/index";
</style>
