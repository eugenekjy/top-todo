import { createProject } from "./project";

export const storage = {
    saveProjects(projects) {
        const dataToSave = projects.map(project => ({
            name : project.getName(),
            todos: project.getTodos().map(todo => ({
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                priority: todo.priority,
                done: todo.getDone()
            }))
        }));
        localStorage.setItem("projects", JSON.stringify(dataToSave));
    },

    loadProjects() {
        const data = localStorage.getItem("projects");
        if (!data) return [];

        const rawProjects = JSON.parse(data);
        return rawProjects.map(rawProject => {
            const project = createProject(rawProject.name);
            rawProject.todos.forEach(rawTodo => {
                project.addTodo({
                    title: rawTodo.title,
                    description: rawTodo.description,
                    dueDate: rawTodo.dueDate,
                    priority: rawTodo.priority
                });
                //set done state
                const lastTodo = project.getTodos().at(-1);
                if (rawTodo.done && !lastTodo.getDone()) lastTodo.toggleDone();
            });
            return project;
        });
    },

    addProjects(project) {
        const projects = this.loadProjects();
        projects.push(project);
        this.saveProjects(projects);
    },

    removeProjects(projectName) {
        let projects = this.loadProjects();
        projects = projects.filter(item => item.name !== projectName);
        this.saveProjects(projects);
    },
}