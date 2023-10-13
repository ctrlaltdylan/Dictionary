import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    slack_bot: {
      type: "app",
      app: "slack_bot",
    },
    db: {
      type: "data_store"
    }
  },
  async run({steps, $}) {
    const channel = await this.db.get('channel');
    const thread_ts = await this.db.get('thread_ts');
    const current_player = await this.db.get('current_player');
    const current_prompt = await this.db.get('current_prompt')
    const prompts = await this.db.get('prompts')
    const current_full_prompt = prompts.find((c) => c.value === current_prompt)
    
    let data = {}
    if(steps.parse_json.$return_value.actions[0].action_id === 'prompt_input') {
      data = {
          channel: current_player.id,
          blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `
Here's the result of your prompt. \n\n 
Click *Choose this image* to choose the image to start the game!`
              }
            },
            {
              "type": "image",
              "title": {
                "type": "plain_text",
                "text": steps.parse_json.$return_value.actions[0].value
              },
              "block_id": "image1",
              "image_url": steps.upload_image.$return_value.data.link,
              "alt_text": steps.parse_json.$return_value.actions[0].value
            },

            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "text": "Choose this image",
                    "emoji": true
                  },
                  "value": steps.upload_image.$return_value.data.link,
                  "action_id": "image_selection"
                }
              ]
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `
Not happy with the image? 

You can try again using the prompt below:`
              }
            },

            {
              "dispatch_action": true,
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "prompt_input"
              },
              "label": {
                "type": "plain_text",
                "text": "Generate another image",
                "emoji": true
              }
            },

          ]
        }
    }

    if(steps.parse_json.$return_value.actions[0].action_id === 'image_selection') {
      data = {
          channel,
          //text: `Here's ${current_player.name}'s image. \n\n take a guess at what they are trying to describe in the thread below! \n\n ${steps.parse_json.$return_value.actions[0].value}`
          blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `
Here's ${current_player.name}'s image. \n\n 
take a guess at what they are trying to describe in the thread below! \n\n
The category of the image is *${current_full_prompt.category}*
`
              }
            },
            {
              "type": "image",
              "title": {
                "type": "plain_text",
                "text": "Take a guess at what this image is!"
              },
              "block_id": "image1",
              "image_url": steps.parse_json.$return_value.actions[0].value,
              "alt_text": "Take a guess at what this image is!"
            },
          ]
        }
    }

    const res = await axios($, {
      url: `https://slack.com/api/chat.postMessage`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
      },
      data
    })

    if(steps.parse_json.$return_value.actions[0].action_id === 'image_selection') {
      await this.db.set('thread_ts', res.ts);
    }

    return res
  },
})
