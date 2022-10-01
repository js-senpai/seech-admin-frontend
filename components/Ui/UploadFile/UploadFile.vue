<template>
  <label class="upload-file">
    <input type="file" id="img" name="img" accept="image/png, image/jpeg" @change="upload()" class="d-none upload-file__input" ref="file">
    <b-img-lazy src="~/assets/img/createRequestModal/download.svg" />
    <span v-if="!getFile" class="upload-file__text">{{ $t('buttons.uploadPhoto') }}</span>
    <b-img-lazy v-else class="upload-file__img" :src="getFile" />
  </label>
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
  mounted() {
    this.text = this.$i18n.t('buttons.uploadPhoto');
  },
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
  methods: {
    async upload(){
      try {
        const newFile = this.$refs.file.files[0];
        const formData = new FormData();
        formData.append('file', newFile);
        const { data: { url } } = await this.$axios.post(`${this.$config.backendUrl}/ticket-image`, formData);
        this.getFile = url;
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
<style lang="scss">
  @import "scss/index";
</style>
