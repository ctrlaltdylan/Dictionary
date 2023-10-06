// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  props: {
    db: {
      type: 'data_store'
    }
  },
  async run({ steps, $ }) {
    const username = steps.trigger.event.body.text.replace('@', '');

    const member = steps.get_record_or_create.$return_value.find((member) => member.name === username)


    await this.db.set('current_player', member);
    return member;


  },
})