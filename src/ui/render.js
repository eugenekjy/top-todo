import { createElement, clearElement, qs } from './dom.js';
import { storage } from '../core/storage.js';
import { createProject } from '../core/project.js';

let projects = [];
let selectedIndex = 0; 

export function initApp() {
    projects = storage.loadProjects();
    if (!projects || projects.length === 0) {
        projects = [createProject('Inbox')];
        storage.saveProjects(projects);
    }

    //initial render
    renderAll();
  
}

function renderAll() {
    renderProjectList();
    renderTodosForSelected();
};

function renderProjectList() {
    const list = qs('#project-list');
    if (!list) return;
    clearElement(list);

    projects.forEach((project, index) => {
        const li = createElement('li', index === selectedIndex ? 'selected' : '', project.getName());

        //select project on click
        li.addEventListener('click', () => {
            selectedIndex = index;
            renderAll();
        });

        //add delete button for project
        const deleteButton = createElement('button', '', 'x');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            projects.splice(index, 1);
            if(selectedIndex >= projects.length) selectedIndex = projects.length - 1;
            renderAll();
        });
        list.appendChild(li);
    });

}

