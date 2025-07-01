import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Strike from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'

export const TIPTAP_EXTENSIONS = [
  Placeholder.configure({
    placeholder: 'Nhập nội dung ở đây...',
    emptyEditorClass: 'is-editor-empty'
  }),
  StarterKit.configure({ heading: false }),
  Heading.configure({ levels: [1, 2] }),
  Underline,
  Strike,
  Subscript,
  Superscript,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] })
]
