import { createTodo } from './todo.js';

export function createProject(name) {
    return {
        name,
        todos: [],

        addTodo(todoData) {
            const todo = createTodo(todoData);
            this.todos.push(todo);
        },

        removeTodo(index) {
            this.todos.splice(index, 1);
        },

        getTodos() {
            return [...this.todos];
        },
    };
};