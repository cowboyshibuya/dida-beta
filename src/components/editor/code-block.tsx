import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer
  
} from '@tiptap/react'
import type {ReactNodeViewProps} from '@tiptap/react';
import { toast } from 'sonner'
import { Icon } from '../icon'

function CodeBlockView({ node }: ReactNodeViewProps) {
  const language = (node.attrs.language as string) || 'plain text'

  const copy = () => {
    navigator.clipboard.writeText(node.textContent)
    toast('Copied to clipboard')
  }

  return (
    <NodeViewWrapper className="codeblock">
      <div className="cb-head" contentEditable={false}>
        <span className="lang">
          <Icon name="code" size={15} /> {language}
        </span>
        <span className="acts">
          <button className="cb-pill" onClick={copy} type="button">
            <Icon name="copy" size={13} /> Copy
          </button>
          <button
            className="cb-pill run"
            type="button"
            onClick={() => toast('Code execution is coming soon')}
          >
            <Icon name="play" size={12} fill="currentColor" /> Run
          </button>
        </span>
      </div>
      <pre>
        <NodeViewContent as={'code' as 'div'} />
      </pre>
    </NodeViewWrapper>
  )
}

// CodeBlockLowlight + a header (language label, Copy, Run) matching the design.
export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },
})
