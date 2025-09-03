import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { OutlineItemComponent } from './OutlineItemComponent'

export const OutlineItem = Node.create({
  name: 'outline_item',

  group: 'block',

  content: 'inline*',

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
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-type': 'outline_item',
        'class': 'outline-item',
        'data-level': HTMLAttributes.level,
        'data-collapsed': HTMLAttributes.collapsed,
        'data-item-type': HTMLAttributes.type,
        'style': `margin-left: ${HTMLAttributes.level * 20}px`,
      },
      [
        'div',
        { 'class': 'outline-item-content' },
        [
          'button',
          {
            'class': 'outline-item-toggle',
            'type': 'button'
          },
          HTMLAttributes.collapsed ? '▶' : '▼'
        ],
        [
          'div',
          { 'class': 'outline-item-text' },
          0
        ]
      ]
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // 現在のノードがOutlineItemの場合
        if ($from.parent.type.name === 'outline_item') {
          const parent = $from.parent;
          const isAtEnd = $from.parentOffset === parent.content.size;

          if (isAtEnd) {
            // 行末の場合、新しいOutlineItemを作成
            editor.commands.splitBlock();

            // 新しいノードの属性を設定
            const { $to } = editor.state.selection;
            if ($to.parent.type.name === 'outline_item') {
              editor.commands.updateAttributes('outline_item', {
                id: `item-${Date.now()}`,
                level: $from.parent.attrs.level,
                collapsed: false,
                type: 'normal',
              });
            }

            return true;
          } else {
            // 行末でない場合、通常の改行を挿入
            editor.commands.setHardBreak();
            return true;
          }
        }

        return false;
      },
      Tab: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === 'outline_item') {
          const currentLevel = $from.parent.attrs.level;
          editor.commands.updateAttributes('outline_item', {
            level: currentLevel + 1,
          });
          return true;
        }

        return false;
      },
      'Shift-Tab': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === 'outline_item') {
          const currentLevel = $from.parent.attrs.level;
          if (currentLevel > 0) {
            editor.commands.updateAttributes('outline_item', {
              level: currentLevel - 1,
            });
          }
          return true;
        }

        return false;
      },
      Space: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === 'outline_item' && $from.parentOffset === 0) {
          const currentLevel = $from.parent.attrs.level;
          editor.commands.updateAttributes('outline_item', {
            level: currentLevel + 1,
          });
          return true;
        }

        return false;
      },
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === 'outline_item') {
          if (selection.empty && $from.parentOffset === 0) {
            // カーソルが行頭にある場合
            const currentLevel = $from.parent.attrs.level;
            if (currentLevel > 0) {
              editor.commands.updateAttributes('outline_item', {
                level: currentLevel - 1,
              });
            } else {
              // レベル0なら行を削除
              if ($from.parent.textContent.length === 0) {
                editor.commands.deleteNode('outline_item');
              } else {
                const prevNode = $from.before() > 0 ? editor.state.doc.resolve($from.before() - 1).parent : null;
                if (prevNode && prevNode.type.name === 'outline_item') {
                  editor.commands.joinBackward();
                } else {
                  editor.commands.deleteNode('outline_item');
                }
              }
            }
            return true;
          } else if (!selection.empty) {
            // 選択範囲がある場合は削除
            editor.commands.deleteSelection();
            return true;
          }
        }

        return false;
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(OutlineItemComponent)
  },
})
