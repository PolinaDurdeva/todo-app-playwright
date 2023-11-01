import { test, expect } from "@playwright/test";
import {
  SELECTORS,
  TODO_ITEMS,
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
} from "../support/todoScreen";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/#/");
});
// beforeEach(async ({ page }) => {
//     // ...
//     await page.addInitScript(value => {
//       window.localStorage.setItem('debug', value);
//     }, testConfigJson);
//   });

test.describe("Delete item", () => {
  test("@smoke - should allow me to delete an item", async ({ page }) => {
    await createDefaultTodos(page);

    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    const deleteButton = secondTodo.locator(SELECTORS.deleteItem);

    await expect(deleteButton).not.toBeVisible();
    await secondTodo.hover();
    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    // Explicitly assert left items.
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("2 items left");
    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});
