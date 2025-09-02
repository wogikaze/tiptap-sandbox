import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { OutlineItemComponent } from './OutlineItemComponent'

export const OutlineItem = Node.create({
  name: 'outline_item',

  group: 'block',

  content: 'text*',

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-id': attributes.id,
          }
        },
      },
      collapsed: {
        default: false,
        parseHTML: element => element.getAttribute('data-collapsed') === 'true',
        renderHTML: attributes => ({
          'data-collapsed': attributes.collapsed,
        }),
      },
      level: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-level') || '0'),
        renderHTML: attributes => ({
          'data-level': attributes.level,
        }),
      },
      type: {
        default: 'normal',
        parseHTML: element => element.getAttribute('data-item-type') || 'normal',
        renderHTML: attributes => ({
          'data-item-type': attributes.type,
        }),
      },
      checked: {
        default: null,
        parseHTML: element => element.getAttribute('data-checked') === 'true',
        renderHTML: attributes => {
          if (attributes.checked === null) {
            return {}
          }
          return {
            'data-checked': attributes.checked,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="outline_item"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'outline_item' }, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(OutlineItemComponent)
  },
})
