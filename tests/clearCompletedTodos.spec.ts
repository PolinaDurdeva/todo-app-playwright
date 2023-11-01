import { test, expect } from '@playwright/test';
import {
  SELECTORS,
  TODO_ITEMS,
  createDefaultTodos,
} from '../support/todoScreen';

test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/#/');
});

test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should display the correct text', async ({ page }) => {
    // Mark an item as completed
    await page
      .locator(SELECTORS.todoItems)
      .nth(1)
      .getByRole('checkbox')
      .check();

    await expect(page.locator(SELECTORS.clearCompleted)).toBeVisible();
    await expect(page.locator(SELECTORS.clearCompleted)).toHaveText('Clear completed');
  });

  test('should remove completed items when clicked', async ({ page }) => {
    // Mark an item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(1).getByRole('checkbox').check();

    await page.locator(SELECTORS.clearCompleted).click();

    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);

    await expect(page.locator(SELECTORS.clearCompleted)).toBeHidden();
  });
});
