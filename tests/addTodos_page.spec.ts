import { test } from '@playwright/test';
import {
  TODO_ITEMS,
  checkNumberOfTodosInLocalStorage,
} from '../support/todoScreen';
import TodoPage from '../pages/todoPage';

let todoPage: TodoPage;
const URL = 'https://todomvc.com/examples/react/#/';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  todoPage = new TodoPage(page);
});

test.describe('New Todo', () => {
  test('@smoke - should allow me to add not empty todo items', async ({
    page,
  }) => {
    // Create 1st todo.
    await todoPage.addNewTodo(TODO_ITEMS[0]);

    // Make sure the list only has one todo item.
    await todoPage.assertItems([TODO_ITEMS[0]]);
    await todoPage.assertNumberOfActiveItemsLeft(1);

    // Create 2nd todo
    await todoPage.addNewTodo(TODO_ITEMS[1]);

    // Make sure the list now has two todo items
    await todoPage.assertItems([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await todoPage.assertNumberOfActiveItemsLeft(2);

    // Make sure empty todo item is not added
    await todoPage.addNewTodo('');
    await todoPage.assertNumberOfItemsInTodoList(2);
    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should clear text input field when an item is added', async ({
    page,
  }) => {
    // Check default state of textbox
    await todoPage.assertTextboxPlaceholder();

    // Create one todo
    await todoPage.addNewTodo(TODO_ITEMS[0]);

    // Check state of textbox
    await todoPage.assertTextboxPlaceholder();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});
