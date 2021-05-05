import { textContent } from './utils'
import type { TriggerOptions } from './createDomEvent'
import { nextTick } from 'vue'

export default abstract class BaseWrapper<ElementType extends Element> {
  private readonly wrapperElement: ElementType

  get element() {
    return this.wrapperElement
  }

  constructor(element: ElementType) {
    this.wrapperElement = element
  }

  classes(): string[]
  classes(className: string): boolean
  classes(className?: string): string[] | boolean {
    const classes = this.element.classList

    if (className) return classes.contains(className)

    return Array.from(classes)
  }

  attributes(): { [key: string]: string }
  attributes(key: string): string
  attributes(key?: string): { [key: string]: string } | string {
    const attributes = Array.from(this.element.attributes)
    const attributeMap: Record<string, string> = {}
    for (const attribute of attributes) {
      attributeMap[attribute.localName] = attribute.value
    }

    return key ? attributeMap[key] : attributeMap
  }

  text() {
    return textContent(this.element)
  }

  exists() {
    return true
  }

  protected isDisabled = () => {
    const validTagsToBeDisabled = [
      'BUTTON',
      'COMMAND',
      'FIELDSET',
      'KEYGEN',
      'OPTGROUP',
      'OPTION',
      'SELECT',
      'TEXTAREA',
      'INPUT'
    ]
    const hasDisabledAttribute = this.attributes().disabled !== undefined
    const elementCanBeDisabled = validTagsToBeDisabled.includes(
      this.element.tagName
    )

    return hasDisabledAttribute && elementCanBeDisabled
  }

  abstract trigger(eventString: string, options?: TriggerOptions): Promise<void>
}
