import { EditorView, Decoration, DecorationSet } from '@codemirror/view';

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
  '.cm-valid-token': {
    color: '#569cd6 !important',
    fontWeight: 'bold !important'
  },
  '.cm-invalid-token': {
    color: '#f44336 !important',
    fontWeight: 'bold !important',
    textDecoration: 'underline wavy #f44336'
  },
  '.cm-unclosed-block': {
    color: '#ff9800 !important',
    fontWeight: 'bold !important',
    textDecoration: 'underline wavy #ff9800'
  }
}, { dark: true });

interface Token {
  token: string;
  pos: number;
  type?: 'valid' | 'invalid' | 'unclosed';
  blockStart?: number;
  blockEnd?: number;
  paired?: boolean;
}

function validateLine(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /{{|}}|@@|@|[{}]/g;
  let match;

  // Находим все токены
  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      token: match[0],
      pos: match.index,
      type: 'invalid' // По умолчанию все токены невалидные
    });
  }

  // Сначала найдем все блоки {{ ... }}
  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    if (current.token === '{{') {
      // Ищем закрывающий }}
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].token === '}}') {
          // Нашли блок - помечаем его границы
          current.type = 'valid';
          tokens[j].type = 'valid';
          // Сохраняем границы блока для всех токенов внутри
          for (let k = i; k <= j; k++) {
            tokens[k].blockStart = i;
            tokens[k].blockEnd = j;
          }
          break;
        }
      }
    }
  }

  // Теперь проверяем все пары собак внутри каждого блока
  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    // Пропускаем уже обработанные собаки
    if (current.token === '@@' && !current.paired && current.blockStart !== undefined) {
      // Ищем закрывающие @@ только внутри текущего блока
      for (let j = i + 1; j <= current.blockEnd!; j++) {
        if (tokens[j].token === '@@' && !tokens[j].paired) {
          // Нашли закрывающие @@ внутри блока
          current.type = 'valid';
          tokens[j].type = 'valid';
          current.paired = true;
          tokens[j].paired = true;
          break;
        }
      }
      // Если не нашли пару, помечаем как unclosed
      if (!current.paired) {
        current.type = 'unclosed';
      }
    }
  }

  // Все одиночные символы и незакрытые блоки остаются invalid
  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    if (current.token.length === 1) { // { или } или @
      current.type = 'invalid';
    } else if (current.token === '}}' && current.type === 'invalid') {
      // Незакрытый }} становится оранжевым
      current.type = 'unclosed';
    }
  }

  // Сортируем токены по позиции
  return tokens.sort((a, b) => a.pos - b.pos);
}

export const syntaxHighlighting = EditorView.decorations.compute(["doc"], state => {
  const decorations = [];
  const doc = state.doc;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const validatedTokens = validateLine(line.text);

    for (const token of validatedTokens) {
      let className;
      switch (token.type) {
        case 'valid':
          className = 'cm-valid-token';
          break;
        case 'invalid':
          className = 'cm-invalid-token';
          break;
        case 'unclosed':
          className = 'cm-unclosed-block';
          break;
      }

      const mark = Decoration.mark({ class: className });
      decorations.push(mark.range(line.from + token.pos, line.from + token.pos + token.token.length));
    }
  }

  return Decoration.set(decorations.sort((a, b) => a.from - b.from));
});
