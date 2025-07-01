import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  PaintbrushIcon,
  TypeIcon,
  UnderlineIcon
} from 'lucide-react'

const highlightColors = ['yellow', 'lightgreen', 'lightblue', 'pink']
const textColors = ['black', 'red', 'blue', 'green', '#ff6600']

const toolbarButtons = [
  { cmd: 'toggleBold', icon: BoldIcon, isActive: 'bold' },
  { cmd: 'toggleItalic', icon: ItalicIcon, isActive: 'italic' },
  { cmd: 'toggleUnderline', icon: UnderlineIcon, isActive: 'underline' },
  {
    custom: true,
    render: editor => <span style={{ fontWeight: 500, textDecoration: 'line-through', fontSize: 16 }}>S</span>,
    onClick: editor => editor.chain().focus().toggleStrike().run(),
    isActive: 'strike',
    title: 'Strikethrough'
  }
]

const listButtons = [
  { cmd: 'toggleBulletList', icon: ListIcon, isActive: 'bulletList' },
  { cmd: 'toggleOrderedList', icon: ListOrderedIcon }
]

const headingButtons = [
  { cmd: 'toggleHeading', icon: Heading1Icon, isActive: e => e.isActive('heading', { level: 1 }), level: 1 },
  { cmd: 'toggleHeading', icon: Heading2Icon, isActive: e => e.isActive('heading', { level: 2 }), level: 2 }
]

const alignButtons = [
  { cmd: 'setTextAlign', icon: AlignLeftIcon, align: 'left', isActive: e => e.isActive({ textAlign: 'left' }) },
  { cmd: 'setTextAlign', icon: AlignCenterIcon, align: 'center', isActive: e => e.isActive({ textAlign: 'center' }) },
  { cmd: 'setTextAlign', icon: AlignRightIcon, align: 'right', isActive: e => e.isActive({ textAlign: 'right' }) }
]

function TiptapToolbar({
  editor,
  highlightRef,
  setShowHighlightOptions,
  showHighlightOptions,
  colorRef,
  showColorPicker,
  setShowColorPicker
}) {
  return (
    <div className="toolbar">
      {toolbarButtons.map((btn, i) =>
        btn.custom ? (
          <button
            key={i}
            type="button"
            className={`toolbar-btn ${editor.isActive(btn.isActive) ? 'active' : ''}`}
            onClick={() => btn.onClick(editor)}
            title={btn.title}
          >
            {btn.render(editor)}
          </button>
        ) : (
          <button
            key={btn.cmd}
            type="button"
            className={`toolbar-btn ${editor.isActive(btn.isActive) ? 'active' : ''}`}
            onClick={() => editor.chain().focus()[btn.cmd]().run()}
          >
            <btn.icon size={16} />
          </button>
        )
      )}

      <div className="highlight-dropdown" ref={highlightRef}>
        <button type="button" className="toolbar-btn" onClick={() => setShowHighlightOptions(v => !v)} title="Highlight">
          <PaintbrushIcon size={16} />
        </button>
        {showHighlightOptions && (
          <div className="highlight-options">
            <button
              type="button"
              style={{ background: 'none' }}
              title="Bỏ highlight"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run()
                setShowHighlightOptions(false)
              }}
            >
              <span style={{ color: '#aaa' }}>x</span>
            </button>
            {highlightColors.map(color => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color }).run()
                  setShowHighlightOptions(false)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="color-dropdown" ref={colorRef}>
        <button type="button" className="toolbar-btn" onClick={() => setShowColorPicker(v => !v)}>
          <TypeIcon size={16} />
        </button>
        {showColorPicker && (
          <div className="color-options">
            <button
              type="button"
              style={{ background: 'none' }}
              title="Bỏ màu chữ"
              onClick={() => {
                editor.chain().focus().unsetColor().run()
                setShowColorPicker(false)
              }}
            >
              <span style={{ color: '#aaa' }}>x</span>
            </button>
            {textColors.map(color => (
              <button
                key={color}
                style={{
                  backgroundColor: color,
                  color: color === 'black' ? '#fff' : '#000',
                  border: '1px solid #e0e0e0'
                }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run()
                  setShowColorPicker(false)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {listButtons.map(btn => (
        <button
          key={btn.cmd}
          type="button"
          className={`toolbar-btn ${btn.isActive ? (editor.isActive(btn.isActive) ? 'active' : '') : ''}`}
          onClick={() => editor.chain().focus()[btn.cmd]().run()}
        >
          <btn.icon size={16} />
        </button>
      ))}

      {headingButtons.map(btn => (
        <button
          key={btn.level}
          type="button"
          className={`toolbar-btn ${btn.isActive(editor) ? 'active' : ''}`}
          onClick={() => editor.chain().focus()[btn.cmd]({ level: btn.level }).run()}
        >
          <btn.icon size={16} />
        </button>
      ))}

      {alignButtons.map(btn => (
        <button
          key={btn.align}
          type="button"
          className={`toolbar-btn ${btn.isActive(editor) ? 'active' : ''}`}
          onClick={() => editor.chain().focus()[btn.cmd](btn.align).run()}
        >
          <btn.icon size={16} />
        </button>
      ))}
    </div>
  )
}

export default TiptapToolbar
