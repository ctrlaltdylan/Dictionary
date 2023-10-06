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
    const channel = await this.db.get('channel')
    // for await(const member of steps.list_members_in_channel.$return_value.members) {
      const channelMembersRes = await axios($, {
        url: 'https://slack.com/api/conversations.members', //`https://slack.com/api/users.list`,
        headers: {
        Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        },
        params: {
          channel: 'C03TAM8US6S'
        }
      })
      const channelMemberIds = channelMembersRes.members;
      console.log(channelMembersRes);
      const allMembersRes = await axios($, {
        url: `https://slack.com/api/users.list`,
        headers: {
        Authorization: `Bearer ${this.slack_bot.$auth.bot_token}`,
        }
      })
      console.log('AllMembersRes', allMembersRes)

      const members = allMembersRes.members
        .map(member => ({ id: member.id, name: member.name, is_bot: member.is_bot }))
        .filter(m => !m.is_bot)
        .filter(m => m.name !== 'slackbot');
      await this.db.set('members', members)
      const players = members.filter(m => channelMemberIds.includes(m.id))
      console.log('players', players)

      

      await this.db.set('channel_member_ids', channelMemberIds)
      await this.db.set('players', players)

      console.log(members)
    // }

    return members
  

  },
})
