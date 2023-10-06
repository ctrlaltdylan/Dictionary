import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    openai: {
      type: "app",
      app: "openai",
    },
    slack_bot: {
      type: "app",
      app: "slack_bot"
    }
  },
  async run({steps, $}) {
    if(steps.parse_json.$return_value.actions[0].action_id === 'prompt_input') {

      try {
      const data = await axios($, {
        url: `https://api.openai.com/v1/images/generations`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openai.$auth.api_key}`,
        },
        data: {
          prompt: steps.parse_json.$return_value.actions[0].value,
          n: 1,
          size: '512x512'
        }
      })

      return data

      } catch(e) {
        console.log(e)
        await axios($, {
          url: `https://slack.com/api/chat.postMessage`,
          method: 'post',
          headers: {
            Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
          },
          data: {
            channel: steps.parse_json.$return_value.user.id,
            text: `Unforunately I couldnt generate an image from your prompt: ${JSON.stringify(e.response.data)}`
          }
        })
        
        $.flow.exit('Open AI failed ot generate an image')
        return e.response.data;
      }
    }
  },
})
