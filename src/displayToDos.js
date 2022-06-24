export default function displayToDos(project, index, dcard, diconPrio, dtask, h4, h5, diconDeleteTask, content){
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