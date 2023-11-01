import { test, expect } from '@playwright/test';
import {
  SELECTORS,
  TODO_ITEMS,
  createDefaultTodos,
} from '../support/todoScreen';

test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/#/');
});

test.describe('Filter Items', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should allow me to display active items', async ({ page }) => {
    // Mark the second item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(1).getByRole('checkbox').check();

    // Filter active items
    const activeFilter = page.getByRole('link', { name: 'Active' });
    await activeFilter.click();

    await expect(activeFilter).toHaveClass('selected');
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should allow me to display completed items', async ({ page }) => {
    // Mark the second item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(1).getByRole('checkbox').check();

    // Filter completed items
    const completedFilter = page.getByRole('link', { name: 'Completed' });
    await completedFilter.click();

    await expect(completedFilter).toHaveClass('selected');
    await expect(todoItems).toHaveText([TODO_ITEMS[1]]);
  });

  test('@smoke - should allow me to display all items', async ({ page }) => {
    // Mark the second item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(1).getByRole('checkbox').check();

    // Switch between filters
    const activeFilter = page.getByRole('link', { name: 'Active' });
    const completedFilter = page.getByRole('link', { name: 'Completed' });
    const allFilter = page.getByRole('link', { name: 'All' });
    await activeFilter.click();
    await completedFilter.click();
    await allFilter.click();

    await expect(activeFilter).not.toHaveClass('selected');
    await expect(completedFilter).not.toHaveClass('selected');
    await expect(allFilter).toHaveClass('selected');
    await expect(todoItems).toHaveText(TODO_ITEMS);
  });

  test('should respect the back button', async ({ page }) => {
    // Mark the second item as completed
    const todoItems = page.locator(SELECTORS.todoItems);
    await todoItems.nth(1).getByRole('checkbox').check();

    await test.step('Showing all items', async () => {
      await page.getByRole('link', { name: 'All' }).click();
      await expect(todoItems).toHaveCount(3);
    });

    await test.step('Showing active items', async () => {
      await page.getByRole('link', { name: 'Active' }).click();
    });

    await test.step('Showing completed items', async () => {
      await page.getByRole('link', { name: 'Completed' }).click();
    });

    await expect(todoItems).toHaveCount(1);
    await page.goBack();
    await expect(todoItems).toHaveCount(2);
    await page.goBack();
    await expect(todoItems).toHaveCount(3);
  });
});
