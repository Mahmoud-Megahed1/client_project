# AI Request Requirements

| Request | Input Needed | Expected Output | Token Size | Cost Range (USD) |
|---------|--------------|-----------------|------------|------------------|
| **PDF analysis** | Cleaned PDF text, metadata (title, language, page count) | Structured JSON with slides array, summary text, risk flags | 3k–6k | $0.12–$0.36 |
| **Summarization** | Text chunk ≤2k tokens, language hint | Summary paragraphs + bullet key points | 600–1k | $0.02–$0.08 |
| **Keyword extraction** | Normalized text chunk, optional domain tag | Array of keywords `{term, score, category}` | 400–800 | $0.01–$0.04 |
| **Free-form text analysis** | Context chunk + user query | JSON `{answer, reasoning, citations}` | 1k–2k | $0.04–$0.10 |
| **Entity extraction** | Text chunk with language | JSON `{entities:[{value,type,start,end}]}` | 800–1.2k | $0.03–$0.09 |

### Estimation Notes
- Token sizes assume preprocessing via `textProcessor` to cut boilerplate.
- Cost ranges cover Gemini Flash, GPT-4o-mini, Claude Haiku tiers.
- Complex or multi-document jobs multiply token estimates by chunk count.
