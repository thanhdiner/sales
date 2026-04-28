import { Node } from '@tiptap/core'
import Link from '@tiptap/extension-link'
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

export const Image = Node.create({
  name: 'image',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes]
  },

  addCommands() {
    return {
      setImage: attrs => ({ commands }) => commands.insertContent({ type: this.name, attrs })
    }
  }
})

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      caption: { default: '' }
    }
  },

  parseHTML() {
    return [{
      tag: 'figure[data-type="image-caption"]',
      getAttrs: node => {
        const image = node.querySelector('img')
        const caption = node.querySelector('figcaption')
        return {
          src: image?.getAttribute('src'),
          alt: image?.getAttribute('alt'),
          title: image?.getAttribute('title'),
          caption: caption?.textContent || ''
        }
      }
    }]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, caption } = HTMLAttributes
    return ['figure', { 'data-type': 'image-caption', class: 'tiptap-figure' }, ['img', { src, alt, title }], ['figcaption', caption || '']]
  }
})

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: { default: 'info' }
    }
  },

  parseHTML() {
    return [{ tag: 'aside[data-type="callout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['aside', { 'data-type': 'callout', class: `tiptap-callout tiptap-callout--${HTMLAttributes.type || 'info'}` }, 0]
  }
})

export const SimpleTable = Node.create({
  name: 'simpleTable',
  group: 'block',
  atom: true,

  parseHTML() {
    return [{ tag: 'table' }]
  },

  renderHTML() {
    return ['table', { class: 'tiptap-table' }, ['tbody', ['tr', ['th', 'Tiêu đề 1'], ['th', 'Tiêu đề 2'], ['th', 'Tiêu đề 3']], ['tr', ['td', 'Nội dung'], ['td', 'Nội dung'], ['td', 'Nội dung']], ['tr', ['td', 'Nội dung'], ['td', 'Nội dung'], ['td', 'Nội dung']]]]
  }
})

export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'video[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', { ...HTMLAttributes, controls: true, class: 'tiptap-video' }]
  }
})

export const Embed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: 'Embedded video' }
    }
  },

  parseHTML() {
    return [{ tag: 'iframe[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', {
      ...HTMLAttributes,
      class: 'tiptap-embed',
      loading: 'lazy',
      allowfullscreen: 'true',
      referrerpolicy: 'strict-origin-when-cross-origin'
    }]
  }
})

export const createTiptapExtensions = ({ placeholder } = {}) => [
  Placeholder.configure({
    placeholder: placeholder || 'Nhập nội dung ở đây...',
    emptyEditorClass: 'is-editor-empty'
  }),
  StarterKit.configure({ heading: false }),
  Heading.configure({ levels: [1, 2] }),
  Image.configure({ inline: false, allowBase64: false }),
  Figure,
  Callout,
  SimpleTable,
  Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
  Video,
  Embed,
  Underline,
  Strike,
  Subscript,
  Superscript,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] })
]
