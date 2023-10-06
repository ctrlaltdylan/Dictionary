// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  async run({ steps, $ }) {
    console.log(steps.get_thread_ts.$return_value, steps.trigger.event.thread_ts )

    if(!steps.get_thread_ts.$return_value) {
      $.flow.exit('No active thread. No game started yet.')
    }
    // Return data to use it in future steps
    if(steps.trigger.event.thread_ts == steps.get_thread_ts.$return_value) {
      return true
    } else {
      $.flow.exit('message outside of current thread')
    }

    if(!steps.get_thread_ts.$return_value) {
      $.flow.exit('game not started')
    }
  },
})