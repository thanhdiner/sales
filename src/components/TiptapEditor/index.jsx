import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

import './TiptapEditor.scss'
import TiptapToolbar from './TiptapToolbar'
import { TIPTAP_EXTENSIONS } from './tiptapExtensions'

const TiptapEditor = ({ value = '', onChange }) => {
  const [showHighlightOptions, setShowHighlightOptions] = useState(false)
  const highlightRef = useRef()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorRef = useRef()

  useEffect(() => {
    const handleClickOutside = event => {
      if (highlightRef.current && !highlightRef.current.contains(event.target)) setShowHighlightOptions(false)
      if (colorRef.current && !colorRef.current.contains(event.target)) setShowColorPicker(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
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

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-editor">
        <TiptapToolbar
          {...{ editor, highlightRef, setShowHighlightOptions, showHighlightOptions, colorRef, showColorPicker, setShowColorPicker }}
        />
        <EditorContent className="dark:bg-gray-800 dark:text-gray-300" editor={editor} />
      </div>
    </div>
  )
}

export default TiptapEditor
