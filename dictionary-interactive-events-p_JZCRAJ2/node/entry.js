import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "URL of the image to be converted to base64",
    },
  },
  async run({ steps, $ }) {
    const response = await axios($, {
      url: this.imageUrl,
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response, 'binary').toString('base64');
    return base64;
  },
});