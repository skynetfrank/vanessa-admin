const myModal = document.getElementById("mymodal-div");
const myModal_btnCerrar = document.getElementById("mymodal-btncerrar");
const myModalMsg = document.getElementById("mymodal-text");
const myModal_btnAceptar = document.getElementById("mymodal-btnaceptar");
const mySpinner = document.getElementById("myspinner-container");


/* window.onload = (event) => {

  setTimeout(() => myModal.classList.add("mostrar-modal"), 3000);

} */

myModal_btnCerrar.addEventListener('click', () => {
  myModalMsg.innerHTML = '';
  myModal.classList.remove("mostrar-modal");
});



function mostrarModal(msg) {
  myModalMsg.innerHTML = '';
  myModalMsg.innerHTML = msg;
  myModal.classList.add("mostrar-modal")
}


myModal_btnAceptar.addEventListener('click', () => {
  mostrarModal("Esto es una prueba de modal yo!");
})