import { EditorView, Decoration } from '@codemirror/view';

const tokenRegex = /{{|}}|@@|[{}@]/g;

export const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4'
  },
  '.cm-content': {
    caretColor: '#569cd6',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    padding: '10px'
  },
  '.cm-line': {
    padding: '0 4px'
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none'
  },
  '.cm-double-token': {
    color: '#569cd6 !important',
    fontWeight: 'bold !important'
  },
  '.cm-single-token': {
    color: '#f44336 !important',
    fontWeight: 'bold !important'
  }
}, { dark: true });

export const syntaxHighlighting = EditorView.decorations.compute(["doc"], state => {
  const decorations = [];
  const doc = state.doc.toString();
  let match;

  while ((match = tokenRegex.exec(doc)) !== null) {
    const from = match.index;
    const to = from + match[0].length;
    const token = match[0];

    if (token === '{{' || token === '}}' || token === '@@') {
      decorations.push(
        Decoration.mark({ class: 'cm-double-token' }).range(from, to)
      );
    } else {
      decorations.push(
        Decoration.mark({ class: 'cm-single-token' }).range(from, to)
      );
    }
  }

  return Decoration.set(decorations);
});

