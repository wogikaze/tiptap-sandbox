// データモデル草案

export interface OutlineItemAttrs {
  id: string; // 安定ID
  collapsed: boolean; // 折りたたみ
  type: 'normal' | 'task'; // 簡易
  level: number; // インデントレベル
  checked?: boolean; // task用
}

export interface Doc {
  type: 'doc';
  content: OutlineItem[];
}

export interface OutlineItem {
  type: 'outline_item';
  attrs: OutlineItemAttrs;
  content?: OutlineItem[];
}

// Zustand store for minimal state management
export interface OutlinerState {
  doc: Doc;
  setDoc: (doc: Doc) => void;
}
