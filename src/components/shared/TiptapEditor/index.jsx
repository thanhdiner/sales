import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  HtmlEmbed,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  SourceEditing,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  Underline
} from 'ckeditor5'
import { useMemo, useRef, useState } from 'react'
import 'ckeditor5/ckeditor5.css'

import './TiptapEditor.scss'

function getTextLength(html) {
  if (typeof window === 'undefined') return String(html || '').replace(/<[^>]*>/g, '').trim().length

  const element = window.document.createElement('div')
  element.innerHTML = html || ''
  return (element.textContent || '').trim().length
}

function createUploadAdapterPlugin(onUploadMedia) {
  return function UploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => ({
      upload: async () => {
        const file = await loader.file
        const media = await onUploadMedia?.(file)

        if (!media?.url) throw new Error('Upload failed')

        return { default: media.url }
      },
      abort: () => {}
    })
  }
}

function TiptapEditor({ value = '', onChange, placeholder, maxLength, onUploadMedia }) {
  const editorRef = useRef(null)
  const lastEmittedHtmlRef = useRef(value || '')
  const videoInputRef = useRef(null)
  const [textLength, setTextLength] = useState(() => getTextLength(value))
  const [editorError, setEditorError] = useState('')

  const editorConfig = useMemo(() => ({
    licenseKey: 'GPL',
    plugins: [
      Alignment,
      BlockQuote,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FontBackgroundColor,
      FontColor,
      GeneralHtmlSupport,
      Heading,
      HorizontalLine,
      HtmlEmbed,
      Image,
      ImageCaption,
      ImageInsert,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Italic,
      Link,
      List,
      MediaEmbed,
      Paragraph,
      SourceEditing,
      Strikethrough,
      Table,
      TableCellProperties,
      TableProperties,
      TableToolbar,
      Underline
    ],
    extraPlugins: [createUploadAdapterPlugin(onUploadMedia)],
    placeholder: placeholder || 'Nhập nội dung ở đây...',
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'link', 'bulletedList', 'numberedList', '|',
        'alignment', 'blockQuote', 'codeBlock', 'horizontalLine', '|',
        'insertImage', 'mediaEmbed', 'htmlEmbed', 'insertTable', '|',
        'sourceEditing', 'undo', 'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    },
    htmlSupport: {
      allow: [
        {
          name: /^(aside|figure|figcaption|table|thead|tbody|tr|th|td|video|source|iframe|span|p|h1|h2|h3|ul|ol|li|blockquote|pre|code|hr|img|a)$/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        '|',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'resizeImage'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    },
    mediaEmbed: {
      previewsInData: true
    }
  }), [onUploadMedia, placeholder])

  const handleVideoUpload = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    const editor = editorRef.current

    if (!file || !editor || !onUploadMedia) return

    const media = await onUploadMedia(file)
    if (!media?.url) return

    editor.execute('htmlEmbed', `<video src="${media.url}" controls class="tiptap-video"></video>`)
  }

  return (
    <div className="tiptap-wrapper ck-blog-editor">
      <div className="tiptap-editor">
        {editorError ? <div className="ck-blog-editor__error">{editorError}</div> : null}
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={value || ''}
          onReady={editor => {
            editorRef.current = editor
            setEditorError('')
            setTextLength(getTextLength(editor.getData()))
          }}
          onChange={(_, editor) => {
            const html = editor.getData()
            lastEmittedHtmlRef.current = html
            setTextLength(getTextLength(html))
            onChange?.(html)
          }}
          onBlur={(_, editor) => {
            const html = editor.getData()
            if ((value || '') !== html && lastEmittedHtmlRef.current !== html) onChange?.(html)
          }}
          onError={(error, { phase }) => {
            setEditorError(`CKEditor failed during ${phase}: ${error.message}`)
          }}
        />
        {onUploadMedia ? (
          <div className="ck-blog-editor__media-actions">
            <button type="button" onClick={() => videoInputRef.current?.click()}>Upload video</button>
            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={handleVideoUpload} />
          </div>
        ) : null}
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
