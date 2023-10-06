// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  async run({ steps, $ }) {
    if(steps.trigger.event.body.user_name !== 'pierce') {
      $.flow.exit('not pierce')
    }
  },
})
