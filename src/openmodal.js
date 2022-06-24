import closeModal from './closemodal';

export default function openModal(listOfProjects, projectsLibrary, section, index, modalVariables, saveType = "", DOMItem1 = "", DOMItem2 = "", DOMItem3 = ""){
  closeModal(modalVariables);
  switch(section){
    case "projects":
      modalVariables[1].style.display = "block";
    break;
    case "edit-project":
      DOMItem1.value = listOfProjects[index];
      saveType.setAttribute("data-index", index);
      modalVariables[2].style.display = "block";
    break;
    case "task":
      DOMItem1.value = projectsLibrary[index].todos.title;
      DOMItem2.value = projectsLibrary[index].todos.due;
      DOMItem3.textContent = projectsLibrary[index].todos.desc;
      saveType.setAttribute("data-index",index);
      modalVariables[4].style.display = "block";
    break;
    case "new-project":
      modalVariables[3].style.display = "block";
    break;
    case "new-task":
      modalVariables[5].style.display = "block";
    break;
  }
  modalVariables[0].style.display = "flex";
}
