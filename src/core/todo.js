export function createTodo({ title, description, dueDate, priority }) {
  let done = false; // private

  const toggleDone = () => {
    done = !done;
  };

  const getDone = () => done; // getter

  return {
    title,
    description,
    dueDate,
    priority,
    toggleDone,
    getDone, // expose "done" safely
  };
}