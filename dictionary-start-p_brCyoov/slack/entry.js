import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    slack: {
      type: "app",
      app: "slack",
    }
  },
  async run({steps, $}) {
    return await axios($, {
      url: `https://slack.com/api/chat.postMessage`,
      method: 'post',
      data: {
        channel: steps.find_mentioned_member.$return_value.id,
        blocks: steps.generate_category_blocks.blocks
      },
      headers: {
        Authorization: `Bearer ${this.slack.$auth.oauth_access_token}`,
      },
    })
  },
})
