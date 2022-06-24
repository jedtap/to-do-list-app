export default function closeModal(modalVariables){
  for (var x in modalVariables){
    modalVariables[x].style.display = "none";
  }
}