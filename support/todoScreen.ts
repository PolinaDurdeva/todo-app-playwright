import { type Page } from '@playwright/test';

export const TODO_ITEMS = [
    'exercise German',
    'prepare to the 3rd interview with company X - home assignemnt & showcase 🚀',
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. \
    The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', \
    making it look like readable English.',
  ];

export const SELECTORS = {
    todoItems: '.todo-list li',
    todoCount: '.todo-count',
    todoList: '.todo-list',
    newTodoItem: '.new-todo',
    completeAll: 'label[for="toggle-all"]',
    clearCompleted: '.clear-completed',
    deleteItem: '.destroy',
    editItem: '.edit',
}

export async function createDefaultTodos(page: Page) {
    // create a new todo locator
    const newTodo = page.locator(SELECTORS.newTodoItem);
  
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }
}
  
export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
      return JSON.parse(localStorage['react-todos']).length === e;
    }, expected);
}
  
export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
      return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
    }, expected);
}
  
export async function checkTodosInLocalStorage(page: Page, title: string) {
    return await page.waitForFunction(t => {
      return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
    }, title);
}
  