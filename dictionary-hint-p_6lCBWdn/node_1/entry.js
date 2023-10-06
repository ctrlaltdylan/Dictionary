// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  async run({ steps, $ }) {
    console.log()
    const currentPrompt = steps.get_all_records.$return_value.all_available_prompts.find((p => p.value === steps.get_all_records.$return_value.current_prompt))
  },
})
