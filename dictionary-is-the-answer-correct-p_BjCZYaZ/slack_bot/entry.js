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
    const isCorrect = ['True.', 'True', 'true', 'true.', 'Yes', 'Yes.', 'yes', 'yes.'].includes(steps.chat.$return_value.choices[0].message.content)
    const curval = await this.db.get('attempts');
    await this.db.set('attempts', curval + 1);
    const channel = await this.db.get('channel')
    const users = await this.db.get('members');
    const correctGuesser = users.find(u => u.id === steps.trigger.event.user);

    if(isCorrect) {
      // assign the start next round to the winner

      // display a success message
      await axios($, {
        url: `https://slack.com/api/chat.postMessage`,
        headers: {
          Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        },
        method: 'post',
        data: {
          text: `:clap: ${correctGuesser.name} guessed correctly!! The prompt was ${steps.get_record_or_create_1.$return_value}`,
          thread_ts: steps.get_thread_ts.$return_value,
          channel,
        }
      })

      //react to answer 
      await axios($, {
        url: `https://slack.com/api/reactions.add`,
        headers: {
          Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        },
        method: 'post',
        data: {
          channel,
          name: `thumbsup`,
          timestamp: steps.trigger.event.ts
        }
      })

      await axios($, {
        url: `https://slack.com/api/reactions.add`,
        headers: {
          Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        },
        method: 'post',
        data: {
          channel,
          name: `tada`,
          timestamp: steps.trigger.event.ts
        }
      })

      // remove the prompt from prompts
      const prompts = await this.db.get('prompts');
      const removedPrompt = prompts.filter(p => p.value !== steps.get_record_or_create_1.$return_value )
      await this.db.set('prompts', removedPrompt);
      
      // remove thread_ts to remove further watching
      await this.db.set('thread_ts', null);
      await this.db.set('current_player', null);
    } 
    const currentPlayer = await this.db.get('current_player')
    if(!isCorrect && steps.trigger.event.user !==  currentPlayer) {
      // TODO: add a keycap emoji as a reaction to show how many people are left that haven't guessed yet
      
      // TODO: if there are no more available people to guess, then display the correct answer

      // add a thumbs down reaction to the missed guess
      return await axios($, {
        url: `https://slack.com/api/reactions.add`,
        headers: {
          Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        },
        method: 'post',
        data: {
          channel,
          name: `thumbsdown`,
          timestamp: steps.trigger.event.ts
        }
      })
    }
  },
})
