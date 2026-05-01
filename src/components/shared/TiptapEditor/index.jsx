import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

import './TiptapEditor.scss'
import TiptapToolbar from './TiptapToolbar'
import { createTiptapExtensions } from './tiptapExtensions'

const getEmbedUrl = value => {
  const url = String(value || '').trim()
  if (!url) return ''

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.replace(/^\//, '')}`
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
      if (parsed.pathname.startsWith('/embed/')) return parsed.href
    }
    if (host === 'player.vimeo.com') return parsed.href
    if (host === 'vimeo.com') return `https://player.vimeo.com/video/${parsed.pathname.replace(/^\//, '')}`

    return parsed.href
  } catch {
    return ''
  }
}

const TiptapEditor = ({ value = '', onChange, placeholder, maxLength, onUploadMedia }) => {
  const [showHighlightOptions, setShowHighlightOptions] = useState(false)
  const highlightRef = useRef()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorRef = useRef()
  const imageInputRef = useRef(null)
  const figureInputRef = useRef(null)
  const videoInputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (highlightRef.current && !highlightRef.current.contains(event.target)) setShowHighlightOptions(false)
      if (colorRef.current && !colorRef.current.contains(event.target)) setShowColorPicker(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const editor = useEditor({
    extensions: createTiptapExtensions({ placeholder }),
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [editor, value])

  const insertUploadedMedia = async file => {
    if (!editor || !file || !onUploadMedia) return

    const media = await onUploadMedia(file)
    if (!media?.url) return

    if (media.resourceType === 'video') {
      editor.chain().focus().insertContent({ type: 'video', attrs: { src: media.url, title: file.name } }).run()
      return
    }

    editor.chain().focus().setImage({ src: media.url, alt: file.name, title: file.name }).run()
  }

  const handleImageUpload = () => imageInputRef.current?.click()
  const handleImageCaption = () => figureInputRef.current?.click()
  const handleVideoUpload = () => videoInputRef.current?.click()

  const handleFileChange = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    await insertUploadedMedia(file)
  }

  const handleFigureFileChange = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!editor || !file || !onUploadMedia) return

    const media = await onUploadMedia(file)
    if (!media?.url) return

    const caption = window.prompt('Nhập caption cho ảnh', '') || ''
    editor.chain().focus().insertContent({
      type: 'figure',
      attrs: { src: media.url, alt: file.name, title: file.name, caption }
    }).run()
  }

  const handleCallout = () => {
    if (!editor) return
    editor.chain().focus().insertContent({
      type: 'callout',
      attrs: { type: 'info' },
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nội dung ghi chú...' }] }]
    }).run()
  }

  const handleTable = () => {
    if (!editor) return
    editor.chain().focus().insertContent({ type: 'simpleTable' }).run()
  }

  const handleVideoEmbed = () => {
    if (!editor) return
    const src = getEmbedUrl(window.prompt('Nhập URL video'))
    if (!src) return
    editor.chain().focus().insertContent({ type: 'embed', attrs: { src, title: 'Embedded video' } }).run()
  }

  const handleLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Nhập URL liên kết', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const textLength = editor?.getText().length || 0

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-editor">
        <TiptapToolbar
          {...{
            editor,
            highlightRef,
            setShowHighlightOptions,
            showHighlightOptions,
            colorRef,
            showColorPicker,
            setShowColorPicker,
            onImageUpload: handleImageUpload,
            onVideoUpload: handleVideoUpload,
            onVideoEmbed: handleVideoEmbed,
            onLink: handleLink,
            onImageCaption: handleImageCaption,
            onCallout: handleCallout,
            onTable: handleTable
          }}
        />
        <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleFileChange} />
        <input ref={figureInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleFigureFileChange} />
        <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={handleFileChange} />
        <EditorContent editor={editor} />
      </div>
      {maxLength ? (
        <div className={`tiptap-character-count ${textLength > maxLength ? 'tiptap-character-count--over' : ''}`}>
          {textLength}/{maxLength}
        </div>
      ) : null}
    </div>
  )
}

export default TiptapEditor
