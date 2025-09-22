import "./styles.css";
import { createTodo } from './core/todo.js'
import { createProject } from './core/project.js'
import { storage } from './core/storage.js'




window.createProject = createProject;
window.createTodo = createTodo;
window.storage = storage;