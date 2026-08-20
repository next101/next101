import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { TipTapEditor } from './TipTapEditor'

const mockEditor = {
  getHTML: vi.fn(() => '<p>Updated content</p>'),
  on: vi.fn(),
  off: vi.fn(),
  destroy: vi.fn(),
}

vi.mock('@mantine/tiptap', () => {
  const LinkExtension = { name: 'link' }

  const Toolbar = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  )
  const ControlsGroup = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  )
  const Content = (props: Record<string, unknown>) => <textarea {...props} />

  const RichTextEditor = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="rich-text-editor">{children}</div>
  )

  RichTextEditor.Toolbar = Toolbar
  RichTextEditor.ControlsGroup = ControlsGroup
  RichTextEditor.Content = Content
  RichTextEditor.Bold = () => <button type="button">bold</button>
  RichTextEditor.Italic = () => <button type="button">italic</button>
  RichTextEditor.Underline = () => <button type="button">underline</button>
  RichTextEditor.Strikethrough = () => <button type="button">strike</button>
  RichTextEditor.ClearFormatting = () => <button type="button">clear</button>
  RichTextEditor.Code = () => <button type="button">code</button>
  RichTextEditor.H1 = () => <button type="button">h1</button>
  RichTextEditor.H2 = () => <button type="button">h2</button>
  RichTextEditor.H3 = () => <button type="button">h3</button>
  RichTextEditor.H4 = () => <button type="button">h4</button>
  RichTextEditor.Blockquote = () => <button type="button">quote</button>
  RichTextEditor.Hr = () => <button type="button">hr</button>
  RichTextEditor.BulletList = () => <button type="button">ul</button>
  RichTextEditor.OrderedList = () => <button type="button">ol</button>
  RichTextEditor.Subscript = () => <button type="button">sub</button>
  RichTextEditor.Superscript = () => <button type="button">sup</button>
  RichTextEditor.Link = () => <button type="button">link</button>
  RichTextEditor.Unlink = () => <button type="button">unlink</button>
  RichTextEditor.AlignLeft = () => <button type="button">left</button>
  RichTextEditor.AlignCenter = () => <button type="button">center</button>
  RichTextEditor.AlignJustify = () => <button type="button">justify</button>
  RichTextEditor.AlignRight = () => <button type="button">right</button>

  return {
    Link: LinkExtension,
    RichTextEditor,
  }
})

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
}))

import { useEditor } from '@tiptap/react'

const mockUseEditor = vi.mocked(useEditor) as unknown as Mock<
  (options?: Record<string, unknown>) => unknown
>

describe('TipTapEditor', () => {
  it('renders fallback when editor is not ready', () => {
    mockUseEditor.mockReturnValue(null)

    renderMantine(<TipTapEditor content="Initial content" onChange={vi.fn()} />)

    expect(screen.getByText('Initial content')).toBeInTheDocument()
  })

  it('renders loading text when editor is not ready and content is empty', () => {
    mockUseEditor.mockReturnValue(null)

    renderMantine(<TipTapEditor content="" onChange={vi.fn()} />)

    expect(screen.getByText('Loading editor...')).toBeInTheDocument()
  })

  it('renders editor when ready', () => {
    mockUseEditor.mockReturnValue(mockEditor)

    renderMantine(<TipTapEditor content="<p>Hello</p>" onChange={vi.fn()} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChange when editor updates', () => {
    const onChange = vi.fn()

    mockUseEditor.mockImplementation((options) => {
      const typedOptions = options as {
        onUpdate?: (props: { editor: typeof mockEditor }) => void
      }
      if (typedOptions?.onUpdate) {
        typedOptions.onUpdate({ editor: mockEditor })
      }
      return mockEditor
    })

    renderMantine(<TipTapEditor content="<p>Test</p>" onChange={onChange} />)

    expect(onChange).toHaveBeenCalledWith('<p>Updated content</p>')
  })
})
