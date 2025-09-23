import "./styles.css";
import { createTodo } from './core/todo.js'
import { createProject } from './core/project.js'
import { storage } from './core/storage.js'
import { initApp } from './ui/render.js';

document.addEventListener('DOMContentLoaded', initApp);

window.createProject = createProject;
window.createTodo = createTodo;
window.storage = storage;
