<template>
  <div>
    <slot name="beforeForm"></slot>
    <form class="schema-form">
      <component
        v-for="field in parsedSchema"
        :key="field.model"
        :is="field.component"
        v-bind="binds(field)"
        :path="getChildrenPath(field)"
        :root="false"
        @update:modelValue="update(field.model, $event)"
        @update-batch="updateBatch(field.model, $event)"
      />
      <slot/>
    </form>
    <slot name="afterForm"></slot>
  </div>
</template>

<script>
import { schemaFormComposable } from './SchemaFormComposable'

export default {
  props: {
    schema: {
      type: [Object, Array],
      default: () => { return [] },
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => !field.model && !field.schema).length === 0
      }
    },
    modelValue: {
      type: Object,
      default: () => { return {} }
    },
    sharedConfig: {
      type: Object,
      default: () => ({})
    },
    path: { type: String, default: '' },
    root: { type: Boolean, default: true }
  },
  setup (props, { emit }) {
    const {
      parsedSchema,
      binds,
      update,
      updateBatch,
      getChildrenPath
    } = schemaFormComposable(props, emit)

    return {
      parsedSchema,
      binds,
      update,
      updateBatch,
      getChildrenPath
    }
  }
}
</script>
