import { computed, watch } from 'vue'
import { useValuesStore } from './valuesStore'

export function schemaFormComposable (props, emit) {
  console.log(props.schema)
  console.log(props.modelValue)

  const valuesStore = useValuesStore()

  if (props.root) {
    valuesStore.state.modelValue = props.modelValue
  }

  watch(() => {
    if (props.root) {
      valuesStore.state.modelValue = props.modelValue
    }
  })

  const parsedSchema = computed(() => {
    if (Array.isArray(props.schema)) return props.schema

    const arraySchema = []
    for (const model in props.schema) {
      arraySchema.push({
        ...props.schema[model],
        model
      })
    }

    return arraySchema
  })

  // console.log(toRefs(props))
  Object.entries(props).forEach(([key, value]) => {
    console.log(key, value)
  })
  console.log(props.schema)
  console.log(valuesStore.state.modelValue)

  const update = (property, value) => {
    console.log(property)

    // valuesStore.state.modelValue[property] = value

    emit('update:modelValue', {
      ...valuesStore.getByPath.value(props.path),
      [property]: value
    })
  }

  const binds = (field) => {
    return isNested(field)
      ? { schema: field.schema }
      : { ...props.sharedConfig, ...field }
  }

  const updateBatch = (property, values) => {
    emit('update:modelValue', {
      ...valuesStore.state.modelValue,
      ...values
    })
  }

  const val = (field) => {
    if (isNested(field)) {
      return {}
    }

    return valuesStore.getModelValueByPath(props.path ? `${props.path}.${field.model}` : field.model)
  }

  const isNested = (field) => {
    // TODO path
    return field.schema && !valuesStore.state.modelValue[field.model]
  }

  const getChildrenPath = (field) => {
    const childrenPath = field.model
    return props.path ? `${props.path}.${childrenPath}` : childrenPath
  }

  return {
    modelValue: valuesStore.state.modelValue,
    parsedSchema,
    binds,
    getChildrenPath,
    val,
    update,
    updateBatch
  }
}
