"use client"

import { useEffect } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import DOMPurify from "isomorphic-dompurify"
import EditorMenu from "../../admin/releases/components/EditorMenu"
import { ReleaseFormValues } from "./types"

interface ReleaseContentEditorProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseContentEditor({ setValue, watch }: ReleaseContentEditorProps) {
  const content = watch("content")

  // TipTap editor – the editor is the source of truth for `content`
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {rel: "noopener noreferrer", target: "_blank"},
      }),
    ],
    content: content || "",
    onUpdate: ({editor}) => {
      setValue("content", editor.getHTML(), {shouldDirty: true})
    },
  })

  // Keep editor in sync if form gets reset externally
  useEffect(() => {
    if (editor && typeof content === "string") editor.commands.setContent(content)
  }, [editor, content])

  return (
    <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-400">Content</label>
        <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-3">
          <EditorMenu editor={editor} />
          <EditorContent editor={editor} className="prose prose-invert prose-purple max-w-none min-h-[220px] focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-400">Preview</label>
        <div
          className="min-h-[300px] px-3 py-2 bg-black/30 border border-purple-500/30 rounded prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((content as string) || "") }}
        />
      </div>
    </div>
  )
}
