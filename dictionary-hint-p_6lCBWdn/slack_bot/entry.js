import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    slack_bot: {
      type: "app",
      app: "slack_bot",
    },
  },
  async run({steps, $}) {
    const currentPrompt = steps.get_all_records.$return_value.prompts.find((p => p.value === steps.get_all_records.$return_value.current_prompt))
    return await axios($, {
      url: `https://slack.com/api/chat.postMessage`,
      headers: {
        Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
      },
      method: 'post',
      data: {
        channel: steps.get_all_records.$return_value.channel,
        thread_ts: steps.get_all_records.$return_value.thread_ts,
        text: `Hint: *${currentPrompt.hint}*`
      }
    })
  },
})
