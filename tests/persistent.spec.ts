import { test, expect } from '@playwright/test';
import {
  SELECTORS,
  TODO_ITEMS,
  checkNumberOfCompletedTodosInLocalStorage,
  createDefaultTodos,
} from '../support/todoScreen';

test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/#/');
});

test.describe('Persistence', () => {
  test('@smoke - should persist its data', async ({ page }) => {
    await createDefaultTodos(page);

    // Mark the second item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(0).getByRole('checkbox').check();

    const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
    await firstTodoCheck.check();
    await expect(todoItems).toHaveText(TODO_ITEMS);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '', '']);

    // Ensure there is 1 completed item.
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Now reload.
    await page.reload();
    await expect(todoItems).toHaveText(TODO_ITEMS);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '', '']);
  });
});
