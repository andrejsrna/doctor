type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }

function parseMarkdown(markdown: string): Block[] {
  const blocks: Block[] = []
  const lines = markdown.split(/\r?\n/)
  let paragraph: string[] = []
  let list: string[] = []

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
  }

  function flushList() {
    if (list.length) {
      blocks.push({ type: "list", items: list })
      list = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 3, text: trimmed.slice(4) })
      continue
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 2, text: trimmed.slice(3) })
      continue
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph()
      list.push(trimmed.slice(2))
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()
  return blocks
}

export default function MarkdownDocument({ content }: { content: string }) {
  const blocks = parseMarkdown(content)

  return (
    <article className="space-y-5 text-lime-50/80">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3"
          return (
            <Tag key={index} className={block.level === 2 ? "pt-4 text-2xl font-black text-white" : "pt-2 text-lg font-bold text-lime-200"}>
              {block.text}
            </Tag>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 border-l border-lime-300/25 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-7">
                  <span className="mr-2 text-lime-300">-</span>
                  {item}
                </li>
              ))}
            </ul>
          )
        }

        return <p key={index} className="leading-7 text-gray-300">{block.text}</p>
      })}
    </article>
  )
}
