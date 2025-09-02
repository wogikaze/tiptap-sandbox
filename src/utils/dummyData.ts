// ダミーデータ生成ユーティリティ

export interface DummyOutlineItem {
  id: string;
  level: number;
  collapsed: boolean;
  type: 'normal' | 'task';
  checked?: boolean;
  content: string;
}

export const generateDummyData = (count: number = 1000): DummyOutlineItem[] => {
  const data: DummyOutlineItem[] = [];
  let currentLevel = 0;
  let itemCount = 0;

  for (let i = 0; i < count && itemCount < count; i++) {
    const level = Math.min(currentLevel + Math.floor(Math.random() * 3) - 1, 5);
    currentLevel = Math.max(0, level);

    const item: DummyOutlineItem = {
      id: `item-${itemCount + 1}`,
      level: currentLevel,
      collapsed: Math.random() < 0.2, // 20%の確率で折りたたみ
      type: Math.random() < 0.3 ? 'task' : 'normal', // 30%の確率でタスク
      content: `Item ${itemCount + 1} at level ${currentLevel}`,
    };

    if (item.type === 'task') {
      item.checked = Math.random() < 0.4; // 40%の確率でチェック済み
    }

    data.push(item);
    itemCount++;
  }

  return data;
};

export const dummyDataToHTML = (data: DummyOutlineItem[]): string => {
  return data.map(item => `
    <div data-type="outline_item"
         data-id="${item.id}"
         data-level="${item.level}"
         data-collapsed="${item.collapsed}"
         data-item-type="${item.type}"
         ${item.checked !== undefined ? `data-checked="${item.checked}"` : ''}>
      ${item.content}
    </div>
  `).join('');
};
