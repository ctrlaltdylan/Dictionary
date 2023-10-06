// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  async run({ steps, $ }) {
return {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hello! It's your turn to play _Dictionary_. Select a category below to get started: .\n\n *Please select a category:*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Click Me",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-0"
				}
			]
		},
	]
}
  },
})