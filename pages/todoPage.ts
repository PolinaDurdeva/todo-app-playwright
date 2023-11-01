import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
    readonly page: Page;
    readonly todoItems: Locator;
    readonly todoCount: Locator;
    readonly newTodoItem: Locator;
    readonly completeAll: Locator;
    readonly clearCompleted: Locator;
    readonly deleteItem: Locator;
    readonly editItem: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.todoItems = page.locator('.todo-list li');
        this.todoCount = page.locator('.todo-count');
        this.newTodoItem = page.locator('.new-todo');
        this.completeAll = page.locator('label[for="toggle-all"]');
        this.deleteItem = page.locator('.clear-completed');
        this.editItem = page.locator('.edit');
    }

    async addNewTodo(text: string) {
        await this.newTodoItem.fill(text);
        await this.newTodoItem.press('Enter');
    }
    
    async completeTodoItem(index: number) {
        const firstTodo = this.todoItems.nth(index);
        await firstTodo.getByRole("checkbox").check();
        await expect(firstTodo).toHaveClass("completed");
    }

    async clearCompletedItems() {
        await this.clearCompleted.click(); 
    }

    async assertNumberOfActiveItemsLeft(expectedNumber: number) {
        const expectedText = expectedNumber == 1 ? `${expectedNumber} item left` : `${expectedNumber} items left`;
        await expect(this.todoCount).toHaveText(expectedText);
    }

    async assertItems(todos: Array<string>) {
        await expect(this.todoItems).toHaveText(todos);
    }

    async assertNumberOfItemsInTodoList(expectedNumber: number) {
        await expect(this.todoItems).toHaveCount(expectedNumber);
    }

    async assertTextboxPlaceholder() {
        await expect(this.newTodoItem).toHaveAttribute('placeholder','What needs to be done?');
        await expect(this.newTodoItem).toBeEmpty();
    }

}

export default TodoPage;