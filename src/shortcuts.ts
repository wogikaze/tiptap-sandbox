// ショートカット仕様

export const shortcuts = {
  // 基本編集
  enter: 'Enter', // 項目分割
  backspace: 'Backspace', // 結合・アンラップ
  tab: 'Tab', // インデント
  shiftTab: 'Shift+Tab', // アウトデント

  // アウトライナ固有操作
  ctrlUp: 'Ctrl+ArrowUp', // 同レベル内移動
  ctrlDown: 'Ctrl+ArrowDown',
  ctrlEnter: 'Ctrl+Enter', // サブツリー折りたたみトグル
  altUp: 'Alt+ArrowUp', // サブツリー移動
  altDown: 'Alt+ArrowDown',

  // ショートカット完全化
  space: 'Space', // リスト化
  home: 'Home', // 行頭移動
  end: 'End', // 行末移動
  ctrlF: 'Ctrl+F', // 検索・置換

  // Undo/Redo
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y', // or 'Ctrl+Shift+Z'
};
