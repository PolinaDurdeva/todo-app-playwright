import { test, expect } from "@playwright/test";
import {
  SELECTORS,
  TODO_ITEMS,
  checkNumberOfTodosInLocalStorage,
  checkTodosInLocalStorage,
  createDefaultTodos,
} from "../support/todoScreen";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/#/");
});

test.describe("Edit item ", () => {
  test("@smoke - should allow me to edit an item", async ({ page }) => {
    await createDefaultTodos(page);

    // Start editing 2nd item
    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();

    await expect(secondTodo).toHaveClass("editing");
    const secondTodoInput = secondTodo.locator(SELECTORS.editItem);
    await expect(secondTodoInput).toHaveValue(TODO_ITEMS[1]);

    // Inser new value
    const newToDoText = "call mom";
    await secondTodoInput.fill(newToDoText);
    await secondTodoInput.press("Enter");

    // Explicitly assert the new text value.
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      newToDoText,
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, newToDoText);
  });
});

test.describe("Editing", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should hide other controls when editing", async ({ page }) => {
    const todoItem = page.locator(SELECTORS.todoItems).nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible();
    await expect(
      todoItem.locator("label", {
        hasText: TODO_ITEMS[1],
      })
    ).not.toBeVisible();
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should save edits on blur", async ({ page }) => {
    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    // Inser new value
    const newToDoText = "call mom";
    const secondTodoInput = secondTodo.locator(SELECTORS.editItem);
    await secondTodoInput.fill(newToDoText);
    await secondTodoInput.blur();

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      newToDoText,
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, newToDoText);
  });

  test("should trim entered text", async ({ page }) => {
    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    // Inser new value
    const newToDoText = "call mom";
    const secondTodoInput = secondTodo.locator(SELECTORS.editItem);
    await secondTodoInput.fill("       " + newToDoText + "        ");
    await secondTodoInput.press("Enter");

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      newToDoText,
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, newToDoText);
  });

  test("should remove the item if an empty text string was entered", async ({
    page,
  }) => {
    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    // Inser new value
    const secondTodoInput = secondTodo.locator(SELECTORS.editItem);
    await secondTodoInput.fill("");
    await secondTodoInput.press("Enter");

    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should cancel edits on escape", async ({ page }) => {
    const todoItems = page.locator(SELECTORS.todoItems);
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    // Inser new value
    const secondTodoInput = secondTodo.locator(SELECTORS.editItem);
    await secondTodoInput.fill("call mom");
    await secondTodoInput.press("Escape");
    await expect(todoItems).toHaveText(TODO_ITEMS);
  });
});
