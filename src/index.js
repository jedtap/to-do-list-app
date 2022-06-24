import './style.css';
import 'bootstrap';
import openModal from './openmodal';
import closeModal from './closemodal';
import displayToDos from './displayToDos';

// -- Functions -- 
 
// Internal processing functions

function projects(name, title, due, desc, prio) {
  this.name = name;
  this.todos = {
      title:title,
      due:due,
      desc:desc,
      prio:prio
  };
};

function saveToMemory(){
  memory.clear();
  memory.setItem("projectsLibrary", JSON.stringify(projectsLibrary));
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// Home functions

function generatePage(index){
  updateProjectText(listOfProjects[index]);
  clearPage();
  for(var x in projectsLibrary){
    if(projectsLibrary[x]){ 
      if (listOfProjects[index] == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content) };
    }
  }
  addTaskButtons();
}

function sort(order){
  switch(order){
    case "priority":
      priority.style.display = "none";
      dateAdded.style.display = "inline";
      clearPage();
      dummyLibrary = [];

      for(var x in projectsLibrary){
        if(projectText.textContent == projectsLibrary[x].name && projectsLibrary[x].todos.prio){
          displayToDos(projectsLibrary[x], x, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content);
          dummyLibrary.push(projectsLibrary[x]);
        };
      }
      for(var x in projectsLibrary){
        if(projectText.textContent == projectsLibrary[x].name && projectsLibrary[x].todos.prio == false){
          displayToDos(projectsLibrary[x], x, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content);
          dummyLibrary.push(projectsLibrary[x]);
        };      
      }

      addTaskButtons();
    break;
    case "date":
      priority.style.display = "inline";
      dateAdded.style.display = "none";
      clearPage();

      for(var x in projectsLibrary){
        if(projectsLibrary[x]){
          if (projectText.textContent == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content) };
        }
      }

      addTaskButtons();
    break;
  }
}

function addTaskButtons(){
  prio = document.querySelectorAll(".prio");
  task = document.querySelectorAll(".task");
  trashTask = document.querySelectorAll(".delete-task");

  prio.forEach(prio => {
    prio.addEventListener("click", () => prioritize(prio.textContent, prio.dataset.index));
  });
  task.forEach(task => {
    task.addEventListener("click", () => openModal(listOfProjects, projectsLibrary, "task", task.dataset.index, modalVariables, saveChanges, viewTitle, viewDue, viewDesc));
  });
  trashTask.forEach(trash => {
    trash.addEventListener("click", () => deleteTask(trash.dataset.index));
  });
}

function prioritize(status, index){
  if(status == "★"){
    projectsLibrary[index].todos.prio = false ;
    selectedPrio = document.querySelector(`[data-index="${index}"][class="icon prio"]`);
    selectedPrio.textContent = "☆";
  } else {
    projectsLibrary[index].todos.prio = true ;
    selectedPrio = document.querySelector(`[data-index="${index}"][class="icon prio"]`);
    selectedPrio.textContent = "★";
  }
  saveToMemory();
}

function saveTaskChanges(){
  index = saveChanges.dataset.index;

  projectsLibrary[index].todos.title = viewTitle.value;
  projectsLibrary[index].todos.due = viewDue.value;
  projectsLibrary[index].todos.desc = viewDesc.value;

  revisedTitle = document.querySelector(`[data-index="${index}"][class="card-title"]`);
  revisedDue = document.querySelector(`[data-index="${index}"][class="card-subtitle mb-2 text-muted"]`);

  revisedTitle.textContent = viewTitle.value;
  revisedDue.textContent = viewDue.value;

  saveToMemory();
  closeModal(modalVariables);
}

function deleteTask(index){
  selectedTrashTask = document.querySelector(`[data-index="${index}"][class="card"]`);
  selectedTrashTask.style.display = "none";
  projectsLibrary[index] = false;
  saveToMemory();
}

//  Project maintenance

function deleteProject(index){
  let ans = confirm("Warning! Are you sure to delete the project with all of its tasks?");
  if(ans == true) {
    deleteProjItem = document.querySelector(`[data-index="${index}"][class="item"]`);
    deleteProjItem.style.display = "none";

    for(var x in projectsLibrary){
      if(listOfProjects[index] == projectsLibrary[x].name){ projectsLibrary[x] = false };
    }
    if(listOfProjects[index] == projectText.textContent){
      projectText.textContent = "";
      clearPage();
      closeProjects.style.display = "none";
    }

    listOfProjects[index] = false;
    saveToMemory();
  };
}

function createNewProj(){
  
  let duplicate = false

  for(var y in listOfProjects){
    if(listOfProjects[y] == newProjName.value){ duplicate = true };
  }
  if(duplicate == false){
    listOfProjects.push(newProjName.value);
    updateProjectText(newProjName.value);
    generateProject(newProjName.value, listOfProjects.length - 1);
    newProjName.value = "";
  }
  clearPage();
  closeModal(modalVariables);
}

function saveNewProjName(index){
  oldProjName = listOfProjects[index];

  if(projectText.textContent == oldProjName){
    projectText.textContent = editProjName.value;
  }

  listOfProjects[index] = editProjName.value;


  for(var x in projectsLibrary){
    if(projectsLibrary[x].name == oldProjName){ projectsLibrary[x].name = editProjName.value }
  }

  clearProjList();
  for(var y in listOfProjects){ generateProject(listOfProjects[y], y) };
  saveToMemory();
}

// New task modal

function saveTheNewTask(){
  let newTask = new projects(projectText.textContent, newTitle.value, newDue.value, newDesc.value, false);
  projectsLibrary.push(newTask);
  saveToMemory();
  displayToDos(newTask, projectsLibrary.length - 1, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content);
  addTaskButtons();

  newTitle.value = "";
  newDue.value = "";
  newDesc.value = "";

  closeModal(modalVariables);
  saveToMemory();
}

// -- DOM Related --

// Home

function updateProjectText(title){
  projectText.textContent = title;
}

function clearPage(){
  var child = content.lastElementChild; 
  while (child) {
    content.removeChild(child);
    child = content.lastElementChild;
  }
}

// Projects Modal

function clearProjList(){
  var child = listDiv.lastElementChild; 
  while (child) {
    listDiv.removeChild(child);
    child = listDiv.lastElementChild;
  }
}

function generateProject(project, index){
  // Goal is to recreate this DOM
  // <div class="item" data-index="1">
  //   <div class="icon pencil" data-index="1">✎</div>
  //   <h5 class="project-title" data-index="1">Project Omega</h5>
  //   <div class="icon delete-project" data-index="1">🗑</div>
  // </div>

  let ditem, diconPencil, dprojTitle, diconDeleteProj;

  ditem = document.createElement("div");
  ditem.setAttribute("class","item");
  ditem.setAttribute("data-index", index);

  diconPencil = document.createElement("div");
  diconPencil.setAttribute("class","icon pencil");
  diconPencil.setAttribute("data-index",index);
  diconPencil.appendChild(document.createTextNode("✎"));

  dprojTitle = document.createElement("h5");
  dprojTitle.setAttribute("class","project-title");
  dprojTitle.setAttribute("data-index",index);
  dprojTitle.appendChild(document.createTextNode(project));

  diconDeleteProj = document.createElement("div");
  diconDeleteProj.setAttribute("class","icon delete-project");
  diconDeleteProj.setAttribute("data-index",index);
  diconDeleteProj.appendChild(document.createTextNode("🗑"));


  diconPencil.addEventListener("click", () => openModal(listOfProjects, projectsLibrary, "edit-project", index, modalVariables, saveName, editProjName));
  dprojTitle.addEventListener("click", () => {
    generatePage(index);
    closeModal(modalVariables);
  });
  diconDeleteProj.addEventListener("click", () => deleteProject(index));


  ditem.appendChild(diconPencil);
  ditem.appendChild(dprojTitle);
  ditem.appendChild(diconDeleteProj);
  listDiv.appendChild(ditem);
}

// -- Initial variables --

// Modal
const overlay = document.querySelector(".overlay");
const projectsModal = document.querySelector(".projects-modal");
const editNameModal = document.querySelector(".edit-name");
const newProject = document.querySelector(".new-project");
const viewTask = document.querySelector(".view-task");
const newTaskModal = document.querySelector(".new-task-modal");
const modalVariables = [overlay, projectsModal, editNameModal, newProject, viewTask, newTaskModal];

// Non-button items found in home page
const projectText = document.querySelector("h2");
const content = document.querySelector(".content");

// Header buttons
const newTask = document.querySelector(".new-task");
const priority = document.querySelector(".priority");
const dateAdded = document.querySelector(".date-added");
const projectsButton = document.querySelector(".projects-button");

// Variables used when creating the DOM of each task
let dcard, diconPrio, dtask, h4, h5, diconDeleteTask;

// Variables used to add event listeners to each task card
let prio, task, trashTask;

// Selection varaibles to know which task card prio and delete was selected
let selectedPrio, selectedTrashTask;

// Selection varaibles to know what is the new value for the task title and due
let revisedTitle, revisedDue;

// List of projects
const closeProjects = document.querySelector(".close-projects");
const newProjectButton = document.querySelector(".new-project-button");
const listDiv = document.querySelector(".list");

// Edit project name
const editProjName = document.querySelector(".edit-proj-name");
const saveName = document.querySelector(".save-name");

// Totally new project
let newProjName = document.querySelector(".new-proj-name");


// Deleting project name.. or the whole project
let oldProjName, deleteProjItem;

// Creating a totally new project name
const createProject = document.querySelector(".create-project");

// Variables when creating a totally new task via the modal
const newTitle = document.querySelector(".new-title"); 
const newDue = document.querySelector(".new-due");
const newDesc = document.querySelector(".new-desc");
const saveNewTask = document.querySelector(".save-new-task");

// Viewing/Editing a task
const viewTitle = document.querySelector(".view-title");
const viewDue = document.querySelector(".view-due");
const viewDesc = document.querySelector(".view-desc");
const saveChanges = document.querySelector(".save-changes");

// Avaiable for both task modals
const closeTask = document.querySelectorAll(".close-task");

// Memory related
let projectsLibrary = [];
let listOfProjects = [];
let dummyLibrary = [];
let index;
let memory = window.localStorage;

// -- Initial event listeners --

// Header buttons
projectsButton.addEventListener("click", () => openModal(listOfProjects, projectsLibrary, "projects", false, modalVariables));
newTask.addEventListener("click", () => openModal(listOfProjects, projectsLibrary, "new-task", false, modalVariables));
priority.addEventListener("click", () => sort("priority"));
dateAdded.addEventListener("click", () => sort("date"));

// List of projects
closeProjects.addEventListener("click", () => closeModal(modalVariables));
newProjectButton.addEventListener("click", () => openModal(listOfProjects, projectsLibrary, "new-project", false, modalVariables));

// Edit project name
saveName.addEventListener("click", () => {
  saveNewProjName(saveName.dataset.index);
  openModal(listOfProjects, projectsLibrary, "projects", false, modalVariables);
});

// Creating a totally new project
createProject.addEventListener("click", () => createNewProj());

// Viewing/Editing/Creating a task
closeTask.forEach(closeTask => {
  closeTask.addEventListener("click", () => closeModal(modalVariables));
});
saveChanges.addEventListener("click", () => saveTaskChanges());
saveNewTask.addEventListener("click", () => saveTheNewTask());

// -- Have a demo? Use this initial data --
// projectsLibrary.push(new projects("Dive to ocean floor","Create ship","2022-07-22","Lorem hwiL wihdkwleW", false));
// projectsLibrary.push(new projects("Dive to ocean floor","Find boat","2022-07-30","Lorem hwiL wihdkwleW", true));
// projectsLibrary.push(new projects("Drill to the earth core","Find team magma","2022-08-15","Lorem hwiL wihdkwleW", false));
// saveToMemory();
// memory.clear();

// -- Retreive projectsLibrary from memory and display first project --

if (memory.getItem("projectsLibrary")){
  projectsLibrary = JSON.parse(memory.getItem("projectsLibrary"));

  for(var x in projectsLibrary){
    if (projectsLibrary[x]){
      updateProjectText(projectsLibrary[x].name);
      break;
    };
  }

  for(var x in projectsLibrary){
    if(projectsLibrary[x]){
      if (projectText.textContent == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content) };
      listOfProjects.push(projectsLibrary[x].name);
    }
  }

  listOfProjects = listOfProjects.filter(onlyUnique);
  for(var y in listOfProjects){ generateProject(listOfProjects[y], y) };
  addTaskButtons();
}
