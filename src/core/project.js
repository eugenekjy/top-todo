import { createTodo } from './todo.js';

export function createProject(name) {
        
        const todos = [];

        const addTodo = (todoData) => {
            const todo = createTodo(todoData);
            todos.push(todo);
        };

        const removeTodo = (index) => {
            todos.splice(index, 1);
        };

        const getTodos = () => [...todos];

        const getName = () => name;

        return { getName, addTodo, removeTodo, getTodos};
};