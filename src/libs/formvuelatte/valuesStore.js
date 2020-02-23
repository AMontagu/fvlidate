import { createStore } from 'pinia'
import objectPath from 'object-path'

export const useValuesStore = createStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'values',
  // a function that returns a fresh state
  state: () => ({
    modelValue: {}
  }),
  // optional getters
  getters: {
    getByPath: (state) => (path) => objectPath.get(state.modelValue, path) || ''
  }
})
