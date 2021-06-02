const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navLinks = document.getElementsByClassName('navLinks')[0];
const iconsMenu = document.getElementsByClassName('i.left')[0];
const usuarioActual = document.getElementById("usuario");
const mostrarData = document.getElementById("div__mostrar");
const agenda = document.getElementById("link-agenda");
const paciente = document.getElementById("link-paciente");
const btnAddPaciente = document.getElementById("btn-agregar-paciente");
const btnConsultarPaciente = document.getElementById("btn-consultar-paciente");
const btnCrearPaciente = document.getElementById("img-crear-paciente");


var pacientex = [];

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

agenda.addEventListener('click', () => {

  document.getElementById("inicio").style.display = "none"
  document.getElementById("section-crear-paciente").style.display = "none"
  document.getElementById("pacientes").style.display = "none"
  document.getElementById("myTimeline").style.display = "initial"

  let timeLista = document.getElementById("ul-timeline");

  db.collection('users').get()
    .then(snapshot => {
      snapshot.docs.forEach(paciente => {
        let currentID = paciente.id
        let appObj = { ...paciente.data(), ['id']: currentID }
        pacientex.push(appObj)
      })
    });

  const getCitas = async () => {
    const allcitas = await db.collection('citas')
      .orderBy('fecha', "asc")
      .orderBy('hora', "asc")
      .onSnapshot(querysnapshot => {
        querysnapshot.forEach((doc) => {
          let data = doc.data();
          const found = pacientex.find(p => p.id === data.paciente);

          let fila = `<li><div> <button style="display: block" class="btn-eliminar-cita">X</button><time>Dia: ${formatearFecha(data.fecha)}
           Hora: ${data.hora}</time><time>Paciente: ${found.nombre} ${found.apellido} </time>
           Mensaje: ${data.msg}           
           </div></li>`
          timeLista.innerHTML += fila
        })
      });
  }
  getCitas();

});




window.addEventListener("load", function () {

});



auth.onAuthStateChanged(async (user) => {

  if (user) {
    usuarioActual.innerHTML = 'hola: ' + user.email;
    document.getElementById("loginId").style.display = "none";
    document.getElementById("logout").style.display = "block";

    document.querySelectorAll("i.left").forEach((icon) => {
      icon.style.color = "rgb(4, 167, 167)";
    })

    document.querySelectorAll(".menu").forEach((elemento) => {
      elemento.style.pointerEvents = "all";
      elemento.style.color = "black";
    })
  } else {
    console.log("auth change...no hay usuario");
    document.getElementById("pacientes").style.display = "none"
    document.getElementById("inicio").style.display = "inline-block"
    document.getElementById("myTimeline").style.display = "none"

    document.querySelectorAll(".menu").forEach((elemento) => {
      elemento.style.pointerEvents = "none";
      elemento.style.color = "rgb(194, 189, 189)";
      console.log("Menu==>:", elemento);
    })
    document.querySelectorAll(".img-menu").forEach((icon) => {
      console.log("icons==>:", icon);
      icon.style.pointerEvents = "none";
      icon.style.opacity = "0.2";
    })
  }
})


toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
})

document.getElementById("img-logo").addEventListener("click", () => {
  document.getElementById("pacientes").style.display = "none"
  document.getElementById("inicio").style.display = "inline-block"
  document.getElementById("myTimeline").style.display = "none"
});

btnAddPaciente.addEventListener('click', (ev) => {
  ev.preventDefault();
  window.open('formulario1.html', '_self');
});


//CONSULTAR TODOS LOS PACIENTES
paciente.addEventListener('click', (ev) => {
  document.getElementById("section-crear-paciente").style.display = "none"
  document.getElementById("inicio").style.display = "none"
  document.getElementById("myTimeline").style.display = "none"
  document.getElementById("pacientes").style.display = "inline-block"
  navLinks.classList.toggle('active');
  ev.preventDefault();
  M.Modal.getInstance(modal__crud).close();


  const allPacientes = async () => {
    const getPacientes = await db.collection('users')
      .onSnapshot(querysnapshot => {
        let table = document.getElementById('pacientes-tbody')
        table.innerHTML = ''
        querysnapshot.forEach((doc) => {

          let data = doc.data();
          let row = `<tr>     <td id="td-id-hidden">${doc.id}</td>
                            <td>${data.nombre}</td>
                            <td>${data.apellido}</td>
                            <td>${data.cedula}</td>
                            <td>
                            <button class="td-btn" id="btn-editar-paciente"> 
                                <img src="images/edit-icon24.png" alt="imagen">
                            </button>
                            <button class="td-btn" id="btn-ver-paciente">
                             <img src="images/search-icon24.png" alt="imagen">
                            </button>
                            <button class="td-btn tooltipped"  id="btn-eliminar-paciente" data-position="bottom" data-tooltip="algo">
                             <img src="images/delete-paciente-icon24.png"  alt="imagen">
                            </button>
                            
                            
                            </td>
                      </tr>`;
          table.innerHTML += row
        })
        if (table.innerHTML === '') {
          document.getElementById("mostrar-citas").style.display = "none";
        }

      });
  }
  allPacientes();
});


btnCrearPaciente.addEventListener('click', () => {
  document.getElementById("pacientes").style.display = "none"
  document.getElementById("inicio").style.display = "none"
  document.getElementById("myTimeline").style.display = "none"
  document.getElementById("section-crear-paciente").style.display = "initial"


})


