import { test, expect } from '@playwright/test';

test('OutlineItem Enter key creates new item', async ({ page }) => {
  // 開発サーバーが起動していることを前提
  await page.goto('http://localhost:5173');

  // エディタが読み込まれるまで待つ
  await page.waitForSelector('.editor-container');

  // ページの状態をリセット（ダミーデータをクリア）
  await page.evaluate(() => localStorage.clear());

  // ページをリロードしてクリアされた状態を反映
  await page.reload();
  await page.waitForSelector('.editor-container');

  // 最初のOutlineItemのテキストをクリック
  const firstItem = page.locator('.outline-item').first();
  await firstItem.locator('.outline-item-text').click();

  // 既存のテキストを全選択してクリア
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');

  // テキストを入力
  await page.keyboard.type('Test item');

  // Enterキーを押す前のアイテム数をカウント
  const initialCount = await page.locator('.outline-item').count();

  // Enterキーを押す
  await page.keyboard.press('Enter');

  // 新しいOutlineItemが作成されたことを確認（+1になる）
  const outlineItems = page.locator('.outline-item');
  await expect(outlineItems).toHaveCount(initialCount + 1);

  // 新しいアイテムが空であることを確認
  const newItem = page.locator('.outline-item').nth(initialCount);
  const newItemText = newItem.locator('.outline-item-text');
  await expect(newItemText).toHaveText('');
});