export function createTodo({title, description, dueDate, priority}) {
    return {
        title,
        description,
        dueDate,
        priority,
        done: false,
        toggleDone() {
            this.done = !this.done;
        },
    };
};