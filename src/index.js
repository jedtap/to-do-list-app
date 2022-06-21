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
    console.log(projectsLibrary);
  } else {
    projectsLibrary[index].todos.prio = true ;
    selectedPrio = document.querySelector(`[data-index="${index}"][class="icon prio"]`);
    selectedPrio.textContent = "★";
    console.log(projectsLibrary);
  }
  saveToMemory();
}


//  -- Project maintenance --

function deleteProject(){
  let ans = confirm("Warning! Are you sure to delete the project with all of its tasks?");
  ans == true ? console.log("Deleted the proj :(") : console.log("We are oks");
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
  projectText.appendChild(document.createTextNode(title));
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
let prio ;
let task ;
let trashTask;

// List of projects
let pencil = document.querySelectorAll(".pencil");
let projectTitle = document.querySelectorAll(".project-title");
let trashProject = document.querySelectorAll(".delete-project");
const closeProjects = document.querySelector(".close-projects");
const newProjectButton = document.querySelector(".new-project-button");

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

// -- Initial event listeners --

// Header buttons
projectsButton.addEventListener("click", () => openModal("projects"));
newTask.addEventListener("click", () => openModal("new-task"));
priority.addEventListener("click", () => sort("priority"));
dateAdded.addEventListener("click", () => sort("date"));



// List of projects
pencil.forEach(pencil => {
  pencil.addEventListener("click", () => openModal("edit-project"));
});
projectTitle.forEach(projectTitle => {
  projectTitle.addEventListener("click", () => {
    console.log("now shows the clicked project");
    closeModal();
  });
});
trashProject.forEach(trash => {
  trash.addEventListener("click", () => deleteProject());
});
closeProjects.addEventListener("click", () => closeModal());
newProjectButton.addEventListener("click", () => openModal("new-project"));

// Edit project name
saveName.addEventListener("click", () => openModal("projects"));

// Creating a totally new project
createProject.addEventListener("click", () => closeModal());

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
  let firstProj = false;
  for(var x in projectsLibrary){
    if(projectsLibrary[x]){
      if (firstProj == false) { firstProj = projectsLibrary[x].name };
      if (firstProj == projectsLibrary[x].name) { displayToDos(projectsLibrary[x], x) };
    }
  }
  addTaskButtons();
  updateProjectText(firstProj);
}



// -- Quick start JavaScript code --

// function displayBook(book, index){

//   // HTML format is based on bootstrap:

//   // <div class="card" style="width: 18rem;" data-index="1">
//   //   <div class="card-body">
//   //     <h2 class="card-title">The Success Principles wefw</h2>
//   //     <h3 class="card-subtitle mb-2 text-muted">Jack Canfield</h3>
//   //     <p class="card-text">No. of pages: 69 </p>
//   //     <button type="button" class="btn btn-outline-primary" data-index="1">Unread</button>
//   //     <br>
//   //     <p class="remove-link">
//   //       <a href="#">Remove book</a>
//   //     </p>
//   //   </div>
//   // </div>

//   card = document.createElement("div");
//   card.classList.add("card");
//   card.setAttribute("style","width: 18rem;");
//   card.setAttribute("data-index", index);
//   container.appendChild(card);
  
//   cardBody = document.createElement("div");
//   cardBody.classList.add("card-body");
//   card.appendChild(cardBody);

//   cardTitle = document.createElement("h2");
//   cardTitle.appendChild(document.createTextNode(book.title));
//   cardTitle.classList.add("card-title");
//   cardBody.appendChild(cardTitle);

//   cardSubtitle = document.createElement("h3");
//   cardSubtitle.appendChild(document.createTextNode(book.author));
//   cardSubtitle.setAttribute("class","card-subtitle mb-2 text-muted");
//   cardBody.appendChild(cardSubtitle);

//   cardText = document.createElement("p");
//   cardText.appendChild(document.createTextNode("No. of pages: " + book.pages));
//   cardText.classList.add("card-text");
//   cardBody.appendChild(cardText);

//   readButton = document.createElement("button");
//   readButton.setAttribute("type","button");
//   readButton.setAttribute("data-index", index);
//   if(book.read){
//     readButton.setAttribute("class","btn btn-primary");
//     readButton.appendChild(document.createTextNode("Read"));
//   } else {
//     readButton.setAttribute("class","btn btn-outline-primary");
//     readButton.appendChild(document.createTextNode("Unread"));
//   }
//   readButton.addEventListener("click", () => changeRead(index) );
//   cardBody.appendChild(readButton);

//   linebreak = document.createElement("br");
//   cardBody.appendChild(linebreak);
  
//   removeLink = document.createElement("p");
//   removeLink.classList.add("remove-link");
//   removeLink.addEventListener("click", () => removeBook(index) )
//   cardBody.appendChild(removeLink);

//   hyperlink = document.createElement("a");
//   hyperlink.appendChild(document.createTextNode("Remove book"));
//   hyperlink.setAttribute("href","#");
//   removeLink.appendChild(hyperlink);
// }

// function openForm(){ overlay.style.display = "flex"; };
// function closeForm(){ overlay.style.display = "none"; };

// function Book(title, author, pages, read){
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.read = read;
// }

// function saveToMemory(){
//   memory.clear();
//   memory.setItem("myLibrary", JSON.stringify(myLibrary));
// }

// function addBookToLibrary(newBook) {
//   myLibrary.push(newBook);
//   saveToMemory();
// }

// function clearForm(){
//   title.value = "";
//   author.value = "";
//   pages.value = "";
//   readForm.checked = false;
// }

// function removeBook(index){
//   let rejectBook = document.querySelector(`[data-index="${index}"][style="width: 18rem;"]`);
//   rejectBook.style.display = "none";

//   myLibrary[index] = false;
//   saveToMemory();
// }

// function changeRead(index){
//   let statusButton = document.querySelector(`[data-index="${index}"][type="button"]`);
    
//   if (myLibrary[index].read){
//     statusButton.setAttribute("class","btn btn-outline-primary");
//     statusButton.textContent = "Unread";
//     myLibrary[index].read = false;
//   } else {
//     statusButton.setAttribute("class","btn btn-primary");
//     statusButton.textContent = "Read";
//     myLibrary[index].read = true;
//   }
  
//   saveToMemory();
// }





// // Initial variables
// // Retreive myLibrary from memory and display all books
// let myLibrary = [];
// let memory = window.localStorage;
// if (memory.getItem("myLibrary")){
//   myLibrary = JSON.parse(memory.getItem("myLibrary"));
//   for(var x in myLibrary) {
//     if(myLibrary[x]){
//       displayBook(myLibrary[x], x);
//     }
//   }
// } 


// // Open, close, and submit form
// openFormButton.addEventListener("click", () => openForm());
// closeFormButton.addEventListener("click", () => closeForm());
// submitForm.addEventListener("click", () => {
//   let newBook = new Book(title.value, author.value, pages.value, readForm.checked);
//   addBookToLibrary(newBook);
//   displayBook(newBook, myLibrary.length - 1);
//   clearForm();
//   closeForm();
// })
