import { test, expect } from "@playwright/test";
import {
  SELECTORS,
  checkNumberOfCompletedTodosInLocalStorage,
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
} from "../support/todoScreen";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/#/");
});

test.describe("Mark items as completed", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("@smoke - should allow me to mark items as complete", async ({
    page,
  }) => {
    // Check first item.
    const firstTodo = page.locator(SELECTORS.todoItems).nth(0);
    await firstTodo.getByRole("checkbox").check();
    await expect(firstTodo).toHaveClass("completed");

    await expect(page.locator(SELECTORS.todoCount)).toHaveText("2 items left");

    // Check second item.
    const secondTodo = page.locator(SELECTORS.todoItems).nth(1);
    await expect(secondTodo).not.toHaveClass("completed");
    await secondTodo.getByRole("checkbox").check();

    await expect(page.locator(SELECTORS.todoCount)).toHaveText("1 item left");

    // Assert completed class.
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).toHaveClass("completed");
  });

  test("@smoke - should allow me to un-mark items as complete", async ({
    page,
  }) => {
    const firstTodo = page.locator(SELECTORS.todoItems).nth(0);
    const secondTodo = page.locator(SELECTORS.todoItems).nth(1);
    const firstTodoCheckbox = firstTodo.getByRole("checkbox");

    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("2 items left");
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("3 items left");
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  });

  test("should allow me to mark all items as completed", async ({ page }) => {
    // Complete all todos.
    await page.locator(SELECTORS.completeAll).click();

    // Ensure all todos have 'completed' class.
    await expect(page.locator(SELECTORS.todoItems)).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("0 items left");
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test("should allow me to clear the complete state of all items", async ({
    page,
  }) => {
    const toggleAll = page.locator(SELECTORS.completeAll);
    // Check and then immediately uncheck.
    await expect(toggleAll).toBeVisible();
    await toggleAll.check();
    await toggleAll.uncheck();

    // Should be no completed classes.
    await expect(page.locator(SELECTORS.todoItems)).toHaveClass(["", "", ""]);
    await expect(page.locator(SELECTORS.todoCount)).toHaveText("3 items left");
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    page,
  }) => {
    const toggleAll = page.locator(SELECTORS.completeAll);
    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Uncheck first todo.
    const firstTodo = page.locator(SELECTORS.todoItems).nth(0);
    await firstTodo.getByRole("checkbox").uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(toggleAll).not.toBeChecked();

    await firstTodo.getByRole("checkbox").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Assert the toggle all is checked again.
    await expect(toggleAll).toBeChecked();
  });
});
