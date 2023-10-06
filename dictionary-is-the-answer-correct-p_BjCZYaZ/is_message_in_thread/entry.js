// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  props: {
    type: 'data_store'
  },
  async run({ steps, $ }) {
    console.log(steps.get_thread_ts.$return_value, steps.trigger.event.thread_ts )
    // Return data to use it in future steps
    if(steps.trigger.event.thread_ts == steps.get_thread_ts.$return_value) {
      return true
    } else {
      $.flow.exit('message outside of current thread')
    }

    const thread_ts = await this.db.get('thread_ts');

    if(!thread_ts) {
      $.flow.exit('game not started')
    }
  },
})