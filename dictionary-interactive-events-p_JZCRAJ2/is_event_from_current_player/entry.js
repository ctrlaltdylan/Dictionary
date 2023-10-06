// To use previous step data, pass the `steps` object to the run() function
import axios from 'axios';

export default defineComponent({
  props: {
    db: {
      type: 'data_store'
    },
    slack_bot: {
      type: "app",
      app: "slack_bot",
    }
  },
  async run({ steps, $ }) {
    const currentPlayer = await this.db.get('current_player')
    // Return data to use it in future steps
    if(currentPlayer.id !== steps.parse_json.$return_value.user.id ) {
              await axios({
          url: `https://slack.com/api/chat.postMessage`,
          method: 'post',
          headers: {
            Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
          },
          data: {
            channel: steps.parse_json.$return_value.user.id,
            text: `Please wait your turn! Gosh.`
          }
        })
    }
  },
})