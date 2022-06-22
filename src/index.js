import './style.css';
import 'bootstrap';

// -- Modal visibility -- 

function openModal(section, index){
  closeModal();
  switch(section){
    case "projects":
      projectsModal.style.display = "block";
    break;
    case "edit-project":
      editProjName.value = listOfProjects[index];
      saveName.setAttribute("data-index", index);
      editNameModal.style.display = "block";
    break;
    case "task":

      viewTitle.value = projectsLibrary[index].todos.title;
      viewDue.value = projectsLibrary[index].todos.due;
      viewDesc.textContent = projectsLibrary[index].todos.desc;
      saveChanges.setAttribute("data-index",index);

      viewTask.style.display = "block";
    break;
    case "new-project":
      newProject.style.display = "block";
    break;
    case "new-task":
      newTaskModal.style.display = "block";
    break;
  }
  overlay.style.display = "flex";
}

function closeModal(){
  overlay.style.display = "none";
  projectsModal.style.display = "none";
  editNameModal.style.display = "none";
  newProject.style.display = "none";
  viewTask.style.display = "none";
  newTaskModal.style.display = "none";
  closeProjects.style.display = "inline";
}

// -- Home functions --

function sort(order){
  switch(order){
    case "priority":
      priority.style.display = "none";
      dateAdded.style.display = "inline";

      clearPage();

      dummyLibrary = [];
      for(var x in projectsLibrary){
        if(projectText.textContent == projectsLibrary[x].name && projectsLibrary[x].todos.prio){
          displayToDos(projectsLibrary[x], x);
          dummyLibrary.push(projectsLibrary[x]);
        };
      }
      for(var x in projectsLibrary){
        if(projectText.textContent == projectsLibrary[x].name && projectsLibrary[x].todos.prio == false){
          displayToDos(projectsLibrary[x], x);
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
          if (projectText.textContent == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x) };
        }
      }
      addTaskButtons();


    break;

  }
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


//  -- Project maintenance --

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




// -- Uncategorized --

function projects(name, title, due, desc, prio) {
  this.name = name;
  this.todos = {
      title:title,
      due:due,
      desc:desc,
      prio:prio
  };
};

function displayToDos(project, index){
  // Goal is to display this HTML structure to class .content
  // <div class="card" data-index="1">
  //    <div class="icon prio" data-index="1">★</div>
  //     <div class="task" data-index="1">
  //       <h4 class="card-title" data-index="1">Create video on whales</h4>
  //       <h5 class="card-subtitle mb-2 text-muted" data-index="1">Due Jan 20, 2022 at 11PM</h5>
  //     </div>
  //    <div class="icon delete-task" data-index="1">🗑</div>
  // </div>

  dcard = document.createElement("div");
  dcard.setAttribute("class","card");
  dcard.setAttribute("data-index",index);

  diconPrio = document.createElement("div");
  diconPrio.setAttribute("class","icon prio");
  diconPrio.setAttribute("data-index",index);
  project.todos.prio == true ? diconPrio.appendChild(document.createTextNode("★")) : diconPrio.appendChild(document.createTextNode("☆"));

  dtask = document.createElement("div");
  dtask.setAttribute("class","task");
  dtask.setAttribute("data-index", index);

  h4 = document.createElement("h4");
  h4.setAttribute("class","card-title");
  h4.setAttribute("data-index",index);
  h4.appendChild(document.createTextNode(project.todos.title));

  h5 = document.createElement("h4");
  h5.setAttribute("class","card-subtitle mb-2 text-muted");
  h5.setAttribute("data-index",index);
  h5.appendChild(document.createTextNode(project.todos.due));

  diconDeleteTask = document.createElement("div");
  diconDeleteTask.setAttribute("class","icon delete-task");
  diconDeleteTask.setAttribute("data-index", index);
  diconDeleteTask.appendChild(document.createTextNode("🗑"));

  dtask.appendChild(h4);
  dtask.appendChild(h5);
  dcard.appendChild(diconPrio);
  dcard.appendChild(dtask);
  dcard.appendChild(diconDeleteTask);
  content.appendChild(dcard);
}

function saveToMemory(){
  memory.clear();
  memory.setItem("projectsLibrary", JSON.stringify(projectsLibrary));
}

function updateProjectText(title){
  projectText.textContent = title;
}


function saveTheNewTask(){
  let newTask = new projects(projectText.textContent, newTitle.value, newDue.value, newDesc.value, false);
  projectsLibrary.push(newTask);
  saveToMemory();

  displayToDos(newTask, projectsLibrary.length - 1 );
  addTaskButtons();

  newTitle.value = "";
  newDue.value = "";
  newDesc.value = "";

  closeModal();
  saveToMemory();
}

function clearPage(){
  var child = content.lastElementChild; 
  while (child) {
    content.removeChild(child);
    child = content.lastElementChild;
  }
}

function clearProjList(){
  var child = listDiv.lastElementChild; 
  while (child) {
    listDiv.removeChild(child);
    child = listDiv.lastElementChild;
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
    task.addEventListener("click", () => openModal("task", task.dataset.index));
  });
  trashTask.forEach(trash => {
    trash.addEventListener("click", () => deleteTask(trash.dataset.index));
  });
}

function deleteTask(index){
  selectedTrashTask = document.querySelector(`[data-index="${index}"][class="card"]`);
  selectedTrashTask.style.display = "none";
  projectsLibrary[index] = false;
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
  closeModal();
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
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


  diconPencil.addEventListener("click", () => openModal("edit-project", index));
  dprojTitle.addEventListener("click", () => {
    generatePage(index);
    closeModal();
  });
  diconDeleteProj.addEventListener("click", () => deleteProject(index));


  ditem.appendChild(diconPencil);
  ditem.appendChild(dprojTitle);
  ditem.appendChild(diconDeleteProj);
  listDiv.appendChild(ditem);
}


function saveNewProjName(index){

  // editProjName.value = listOfProjects[index];

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

function generatePage(index){
  updateProjectText(listOfProjects[index]);
  clearPage();
  for(var x in projectsLibrary){
    if(projectsLibrary[x]){ 
      if (listOfProjects[index] == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x) };
    }
  }
  addTaskButtons();
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
  closeModal();
}

// -- Initial variables --

// Modal
const overlay = document.querySelector(".overlay");
const projectsModal = document.querySelector(".projects-modal");
const editNameModal = document.querySelector(".edit-name");
const newProject = document.querySelector(".new-project");
const viewTask = document.querySelector(".view-task");
const newTaskModal = document.querySelector(".new-task-modal");

// Non-button items found in home page
const projectText = document.querySelector("h2");
const content = document.querySelector(".content");

// Header buttons
const projectsButton = document.querySelector(".projects-button");
const newTask = document.querySelector(".new-task");
const priority = document.querySelector(".priority");
const dateAdded = document.querySelector(".date-added");

// Task buttons
let prio;
let task;
let trashTask;

// List of projects
let pencil = document.querySelectorAll(".pencil");
let projectTitle = document.querySelectorAll(".project-title");
let trashProject = document.querySelectorAll(".delete-project");
const closeProjects = document.querySelector(".close-projects");
const newProjectButton = document.querySelector(".new-project-button");
const listDiv = document.querySelector(".list");

// Edit project name
const saveName = document.querySelector(".save-name");

// Creating a totally new project
const createProject = document.querySelector(".create-project");

// Viewing/Editing/Creating a task
const newTitle = document.querySelector(".new-title"); 
const newDue = document.querySelector(".new-due");
const newDesc = document.querySelector(".new-desc");
const closeTask = document.querySelectorAll(".close-task");
const saveChanges = document.querySelector(".save-changes");
const saveNewTask = document.querySelector(".save-new-task");
const viewTitle = document.querySelector(".view-title");
const viewDue = document.querySelector(".view-due");
const viewDesc = document.querySelector(".view-desc");


// -- Uncategorized --
let dcard, diconPrio, dtask, h4, h5, diconDeleteTask;
let memory = window.localStorage;
let dummyLibrary = [];
let selectedPrio, selectedTrashTask;
let revisedTitle, revisedDue;
let index;
let listOfProjects = [];
let ditem, diconPencil, dprojTitle, diconDeleteProj;
const editProjName = document.querySelector(".edit-proj-name");
let oldProjName, revisingProjName ;
let deleteProjItem;
let newProjName = document.querySelector(".new-proj-name");


// -- Initial event listeners --

// Header buttons
projectsButton.addEventListener("click", () => openModal("projects"));
newTask.addEventListener("click", () => openModal("new-task"));
priority.addEventListener("click", () => sort("priority"));
dateAdded.addEventListener("click", () => sort("date"));



// List of projects
closeProjects.addEventListener("click", () => closeModal());
newProjectButton.addEventListener("click", () => openModal("new-project"));

// Edit project name
saveName.addEventListener("click", () => {
  saveNewProjName(saveName.dataset.index);
  openModal("projects");
});

// Creating a totally new project
createProject.addEventListener("click", () => createNewProj());

// Viewing/Editing/Creating a task
closeTask.forEach(closeTask => {
  closeTask.addEventListener("click", () => closeModal());
});
saveChanges.addEventListener("click", () => saveTaskChanges());
saveNewTask.addEventListener("click", () => saveTheNewTask());





// -- Populate initial data --

let projectsLibrary = [];
projectsLibrary.push(new projects("Dive to ocean floor","Create ship","2022-07-22","Lorem hwiL wihdkwleW", false));
projectsLibrary.push(new projects("Dive to ocean floor","Find boat","2022-07-30","Lorem hwiL wihdkwleW", true));
projectsLibrary.push(new projects("Drill to the earth core","Find team magma","2022-08-15","Lorem hwiL wihdkwleW", false));
saveToMemory();



// Retreive projectsLibrary from memory and display first project
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
      if (projectText.textContent == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x) };
      listOfProjects.push(projectsLibrary[x].name);
    }
  }

  listOfProjects = listOfProjects.filter(onlyUnique);


  for(var y in listOfProjects){ generateProject(listOfProjects[y], y) };

  addTaskButtons();
}
