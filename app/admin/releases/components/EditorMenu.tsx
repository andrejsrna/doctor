"use client"

import { Editor } from "@tiptap/react"

export default function EditorMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const btn = (active: boolean) => `px-2 py-1 rounded border text-sm ${active ? 'bg-purple-700/60 border-purple-500/60' : 'bg-black/40 border-purple-500/30 hover:bg-black/60'}`

  const promptLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const input = window.prompt('URL', prev || '')
    if (input === null) return
    const url = input.trim()
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run()
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button className={btn(!editor.isActive('heading') && !editor.isActive('codeBlock') && !editor.isActive('blockquote'))} onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
      <button className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <span className="mx-1" />
      <button className={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <span className="mx-1" />
      <button className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;Quote&rdquo;</button>
      <button className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
      <span className="mx-1" />
      <button className={btn(editor.isActive('link'))} onClick={promptLink}>Link</button>
      <button className={btn(false)} onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>
    </div>
  )
}


