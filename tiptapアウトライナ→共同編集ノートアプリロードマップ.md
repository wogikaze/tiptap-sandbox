# tiptapアウトライナ → 共同編集ノートアプリ ロードマップ

> ゴール：tiptap v3 を用いた高速・堅牢なアウトライナを完成させ、後段でCRDTベースの共同編集に拡張して「ノートアプリ」へ昇華する。
> 期間目安：8〜12週（個人開発前提）

---

## 全体像（フェーズと主成果物）

- **P0: 設計と土台（Week 0）**

  - 技術選定：React + tiptap v3、Vite、Vitest、Playwright、ESLint/Prettier、Zustand（状態は最小限）
  - データモデル草案（後述）／ショートカット仕様（後述）
  - 最低限のドキュメント／テスト雛形

- **P1: 表示（レンダリング）MVP（Week 1）**

  - ノード（アウトライン項目）のツリー表示、折りたたみ状態の反映
  - スタイル：階層インデント、行番号
  - 受け入れ基準：1000行のダミーデータで60fpsスクロール

- **P2: 基本編集（Week 2）**

  - Enterで項目分割、Backspaceで結合・アンラップ
  - Tab/Shift+Tabでインデント/アウトデント
  - 受け入れ基準：Undo/Redo（Cmd/Ctrl+Z / Shift+Z）で全操作が往復可能

- **P3: アウトライナ固有操作（Week 3）**

  - Ctrl+↑/↓で同レベル内の移動（スワップ）
  - Ctrl+Enterでサブツリー折りたたみトグル
  - Alt+↑/↓でサブツリー丸ごと移動
  - 受け入れ基準：サブツリー移動後も順序・階層・折りたたみが正しく保存

- **P4: ショートカット完全化 & 入力ルール（Week 4）**

  - spaceでリスト化、見出しは用いない
  - 行頭/行末スマート移動（Home/End強化）
  - 検索・置換（Ctrl+F; 置換はP6でも可）

- **P5: 永続化（Week 5）**

  - ローカル：debounce保存（localStorage→IndexedDB）
  - 低リスクなエクスポート/インポート（JSON）
  - 受け入れ基準：クラッシュ後も最後の保存状態へ復元

- **P6: 体験磨き & アクセシビリティ（Week 6）**

  - バーチャルリスト（数万行でも軽快）
  - キーボード・スクリーンリーダー対応（aria-level, aria-expanded）
  - セルフプロファイル（大規模ノートでの操作遅延<16ms）

- **P7: 拡張性（Week 7）**

  - プラグイン/スロットレンダラー設計（アイコン、タグ、担当者、進捗や画像等）
  - コマンドAPI（拡張・外部制御用）

- **P8: E2E/回帰テスト整備（Week 8）**

  - 操作シナリオの自動化（Playwright）
  - ショートカット衝突検知・国際配列検証（US/JIS）

- **P9: 共同編集アーキ設計（Week 9）**

  - Y.js + tiptap Collaboration（CRDT）
  - Awareness（カーソル、選択範囲）
  - 同期層：Hocuspocus or y-websocket（後述）

- **P10: サーバ・認証・権限（Week 10）**

  - Hocuspocus（Node）／Auth（Clerk/Auth.js等）
  - ドキュメントACL（owner, editor, viewer）／招待リンク
  - 監査ログ（optional）

- **P11: ノートアプリ化（Week 11）**

  - ノート一覧、フォルダ、検索、最近使った項目
  - シェア、テンプレート、スター/タグ

- **P12: 安定化（Week 12）**

  - 競合実験、ネットワーク分断テスト、オフライン→復帰
  - バージョン/スナップショット、バックアップ、エクスポート

---

## データモデル（提案）

**Doc**（1ノート=1 Tiptap/ProseMirror Doc）

- `type: doc` → ルート
- `outline_item` ノード反復（子として `outline_item` を持てる）

**outline\_item attrs**

- `id: string`（安定ID）
- `collapsed: boolean`（折りたたみ）
- `type: 'normal' | 'task'`（簡易）
- `level: number` (インデントレベル)
- `checked?: boolean`（task用）
- `meta?: Record<string, any>`（タグ等の拡張）

**text**

- 段落テキストは `content` として保持（inline）

> メモ：リスト形式ではなく「任意入れ子の outline\_item」を一次元ツリーとして保持。ノード移動・再帰操作の実装が容易。

---

## キーマップ（初期案）

- **Enter**: 分割（カーソル以降を新項目へ）
- **Shift+Enter**: 分割後、インデントレベルを0にする
- **Backspace**: インデントレベルを1下げる／インデントレベルが0なら一つ上の行とmerge
- **Tab / Shift+Tab**: インデント／アウトデント
- **Alt+↑ / Alt+↓**: 子供のツリーを含めてスワップ
- **Ctrl+Enter**: 折りたたみトグル（サブツリー）
- **Home/End**: スマート行頭/末尾（トグル式）
- **Ctrl/Cmd+F**: 検索、**Ctrl/Cmd+H**: 置換

---

## コア実装の要点

1. **Tiptap拡張（Extension）**

   - `OutlineItem`：schema + commands（split/join/indent/outdent/moveUp/moveDown/toggleCollapse）

2. **ツリーロジック**

   - 選択中ノードのパス（depth, pos）を高速に取得
   - サブツリーの cut/paste（トランザクション）
   - 折りたたみ：描画/選択の両方で不可視領域をスキップ

3. **パフォーマンス**

   - バーチャルレンダリング（react-virtual 等）
   - 大量編集時は**トランザクション集約**＋**debounce保存**

4. **永続化**

   - P5：IndexedDB（Dexie）→ サーバ同期前の土台
   - エクスポート/インポート（JSON/Markdown）

---

## テスト戦略

- **Unit（Vitest）**: commands（分割/結合/インデント/移動/折りたたみ）
- **Integration（JSDOM）**: 入力ルール、Paste、Undo/Redo
- **E2E（Playwright）**: ショートカット網羅、巨大文書操作、折りたたみ
- **パフォーマンス**: 1万行×3階層の操作遅延測定

---

## コラボレーション設計（P9以降）

- **CRDT**: Y.js（tiptap-collaboration / collaboration-cursor）
- **Transport**: Hocuspocus（WebSocketサーバ） or y-websocket
- **Awareness**: カーソル色、ユーザー名、在席、選択範囲
- **権限**: ドキュメントID毎に read/write、presenceはread
- **オフライン**: IndexedDBキャッシュ→再接続時にY.jsが自動マージ
- **スナップショット**: 定期保存＋手動スナップショットAPI

---

## サーバ／アプリ層（P10〜P11）

- **API**:  ノート一覧、作成、共有、権限、最近更新、検索
- **Auth**: Clerk / Auth.js / Firebase Auth いずれか
- **DB**: Postgres（Drizzle/Prisma）or Supabase（手早い）
- **ファイル構成（例）**
  - `/packages/editor`（独立したtiptap拡張＆UI）
  - `/apps/web`（SPA）
  - `/apps/server`（Hocuspocus + REST）

---

## リスク & 先行スパイク

- **巨大文書の描画遅延** → P6前にバーチャルリスト検証
- **ショートカット衝突（JIS）** → P8で配列別E2E
- **CRDT境界の副作用** → P9前に「サブツリー移動×同時編集」検証
- **折りたたみ×コラボ** → `collapsed`はローカル表示属性に分離も検討

---

## マイルストーンの受け入れ基準（要約）

- **MVP（P1〜P3）**: 表示・基本操作・アウトライナ特有操作が安定、Undo/Redo完全
- **β（P4〜P6）**: ショートカット網羅、IndexedDB復元、1万行でも実用
- **コラボα（P9〜P10）**: 同期・presence・権限が一通り動作
- **ノートアプリ（P11〜P12）**: 一覧・共有・検索、安定運用

---

## 次アクション（今すぐ着手）

1. リポ雛形作成（editorパッケージ分離）
2. `OutlineItem` スキーマ＆Enter/Backspace/Tabの3コマンド実装
3. ダミーデータ1k行でスクロール/編集の体感測定
4. 保存：localStorage→IndexedDBへ切替
5. P3のAlt+↑/↓、Cmd/Ctrl+Enterの実装とテスト

---

### 付録：ショートカット一覧（ドラフト）

| 機能           | Win/Linux             | macOS               |
| ------------ | --------------------- | ------------------- |
| 分割           | Enter                 | Enter               |
| 同項目内改行       | Shift+Enter           | Shift+Enter         |
| 結合/アンラップ     | Backspace             | Backspace           |
| インデント/アウトデント | Tab / Shift+Tab       | Tab / Shift+Tab     |
| 同レベル移動       | Alt+↑ / Alt+↓         | Option+↑ / Option+↓ |
| 折りたたみ        | Ctrl+Enter            | Cmd+Enter           |
| 検索/置換        | Ctrl+F / Ctrl+H       | Cmd+F / Cmd+Shift+H |
| Undo/Redo    | Ctrl+Z / Ctrl+Shift+Z | Cmd+Z / Cmd+Shift+Z |

---

> 必要なら、要求仕様（ユーザーストーリー/受け入れ条件）とテストケースを別ドキュメントで展開できます。

