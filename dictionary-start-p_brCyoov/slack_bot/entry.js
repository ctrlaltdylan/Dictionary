import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    slack_bot: {
      type: "app",
      app: "slack_bot",
    },
		db: {
			type: 'data_store'
		}
  },
  async run({steps, $}) {
    const prompts = steps.get_prompts.$return_value;
    const selectedKeyword = prompts[Math.floor(Math.random() * prompts.length)];
		const phrase = selectedKeyword.value;
		const category = selectedKeyword.category;
		const hint = selectedKeyword.hint

		await this.db.set('current_prompt', phrase);
    
    return await axios($, {
      headers: {
        Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        // "Content-Type": "application/json"
      },
      url: `https://slack.com/api/chat.postMessage`, //postMessage
      method: 'post',
      data: {
        channel: steps.find_mentioned_member.$return_value.id, // 'C05027HTB27',
        //user: steps.find_mentioned_member.$return_value.id,
      blocks:  [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `
Hello! It's your turn to play _Dictionary_. \n\n 
Try to use images generated from Dall-E to get your teammates to guess the keyword below. \n\n
Your keyword is \`${phrase}\` \n\n 
In the category ${category} \n\n
The hint is ${hint} \n\n
And _don't_ use the keyword in your prompts! \n\n Also please give me a moment or two to generate your image. I can be slow sometimes sorry :) `
			}
		},
		{
			"type": "divider"
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
				"text": "Generate an image",
				"emoji": true
			}
		}
	]
      },
    })
  },
})
