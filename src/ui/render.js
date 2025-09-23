import { createElement, clearElement, qs } from './dom.js';
import { storage } from '../core/storage.js';
import { createProject } from '../core/project.js';
import { parseISO, format, isPast } from 'date-fns';


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

    // wire buttons (only if they exist in the DOM)
  const addProjBtn = qs('#add-project-btn');
  if (addProjBtn) addProjBtn.addEventListener('click', () => openModal('project-modal'));

  const addTodoBtn = qs('#add-todo-btn');
  if (addTodoBtn) addTodoBtn.addEventListener('click', () => openModal('todo-modal'));

   // Close modals
  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  
  //Form submits
  qs('#project-form')?.addEventListener('submit', (e) => {
    handleAddProject(e);
  });

  //todo submit
  qs('#todo-form')?.addEventListener('submit', (e) => {
    handleAddTodo(e);
  });
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
        const li = createElement('li', index === selectedIndex ? 'selected list-block' : 'list-block', project.getName());

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
            storage.saveProjects(projects);
            renderAll();
        });
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

function renderTodosForSelected () {
    const titleEl = qs('#project-title');
    const list = qs('#todo-list');

    if(!list) return;
    
    const project = projects[selectedIndex];
    if (!project) {
        if(titleEl) titleEl.textContent = "No project";
        clearElement(list);
        return
    }

    if (titleEl) titleEl.textContent = project.getName();
    clearElement(list);

    project.getTodos().forEach((todo, index) => {
        let displayDate = '-';
        let isOverdue = false;

        const container = createElement('div', '', '');
        //checkbox 
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = todo.getDone();
        cb.addEventListener('change', () => {
            todo.toggleDone();
            storage.saveProjects(projects);
            renderTodosForSelected();
        });
        //title
        const label = createElement('span', '', todo.title);
         label.addEventListener('click', () => {
            smallDiv.classList.toggle('hidden');
         }); 
        //div for small
        const smallDiv = createElement('div', '', '');
        // small details
        if (todo.dueDate) {
            const parsedDate = parseISO(todo.dueDate);
            displayDate = format(parsedDate, 'd MMM yyyy');

            //compare only the date;
            if (isPast(parsedDate)) isOverdue = true;
        }
        //main li
        const li = createElement('li',
        (todo.getDone() ? 'todo-done todo-list-block' : 'todo-list-block') + (isOverdue ? ' overdue' : ''),'');
        //small
        const small = createElement('small', '', `Due: ${displayDate} • `);
        // prioritySpan
        const prioritySpan = createElement('span', `priority ${todo.priority.toLowerCase()}`, todo.priority || '-');
        //delete button
        const deleteButton = createElement('button', '', 'x');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            project.removeTodo(index);
            storage.saveProjects(projects);
            renderAll();
        });
        //assembly
        container.appendChild(cb);
        container.appendChild(label);
        smallDiv.appendChild(small);
        small.appendChild(prioritySpan);
        container.appendChild(smallDiv);
        li.appendChild(container);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });
}

// ----- Handlers  -----
function handleAddProject(e) {
    e.preventDefault();
    const input = qs('#project-name');
    console.log(input);
    const name = input.value.trim();
    if (!name) {
    alert('Project name cannot be empty.');
    return;
     }
  const p = createProject(name);
  projects.push(p);
  storage.saveProjects(projects);
  selectedIndex = projects.length - 1;
  renderAll();
  // reset form + close modal
  input.value = '';
  closeModal('project-modal'); 
}

function handleAddTodo(e) {
        e.preventDefault();
        console.log('Form submitted');
    const project = projects[selectedIndex];
    if (!project) return alert('No project selected.');
    console.log(project);
        const title = qs('#todo-title').value.trim();
        const description = qs('#todo-desc').value.trim();
        const dueDate = qs('#todo-due').value;
        const priority = qs('#todo-priority').value
        console.log(title, description, dueDate, priority);
    project.addTodo({ title, description, dueDate, priority });
    storage.saveProjects(projects);
    renderTodosForSelected();
    // reset + close
    qs('#todo-form').reset();
    closeModal('todo-modal');
}

// ----modal

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

