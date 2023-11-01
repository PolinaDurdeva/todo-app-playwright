import { test, expect } from "@playwright/test";
import {
  SELECTORS,
  TODO_ITEMS,
  checkNumberOfTodosInLocalStorage,
} from "../support/todoScreen";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/#/");
});

test.describe("New Todo", () => {
  test("@smoke - should allow me to add not empty todo items", async ({
    page,
  }) => {
    // create a new todo locator
    const newTodo = page.locator(SELECTORS.newTodoItem);

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Make sure the list only has one todo item.
    await expect(page.locator(SELECTORS.todoItems)).toHaveText([TODO_ITEMS[0]]);
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("1 item left");

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");

    // Make sure the list now has two todo items.
    await expect(page.locator(SELECTORS.todoItems)).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("2 items left");

    // Make sure empty todo item is not added
    await newTodo.press("Enter");
    await expect(page.locator(SELECTORS.todoItems)).toHaveCount(2);
    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    // create a new todo locator
    const newTodo = page.locator(SELECTORS.newTodoItem);
    await expect(newTodo).toHaveAttribute(
      "placeholder",
      "What needs to be done?"
    );

    // Create one todo item.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Check that input is empty.
    await expect(newTodo).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});
