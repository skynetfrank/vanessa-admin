const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navLinks = document.getElementsByClassName('navLinks')[0];
const iconsMenu = document.getElementsByClassName('i.left')[0];
const usuarioActual = document.getElementById("usuario");
const mostrarData = document.getElementById("div__mostrar");
const agenda = document.getElementById("link-agenda");
const paciente = document.getElementById("link-paciente");
const btnAddPaciente = document.getElementById("btn-agregar-paciente");
const btnVerHistoria = document.getElementById("btn-ver-paciente");
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
  navLinks.classList.toggle('active');

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



auth.onAuthStateChanged(async (user) => {

  if (user) {
    usuarioActual.innerHTML = user.email;
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



//CONSULTAR TODOS LOS PACIENTES
paciente.addEventListener('click', (ev) => {
  document.getElementById("section-crear-paciente").style.display = "none"
  document.getElementById("inicio").style.display = "none"
  document.getElementById("myTimeline").style.display = "none"
  document.getElementById("pacientes").style.display = "inline-block"
  navLinks.classList.toggle('active');
  ev.preventDefault();
 
  const allPacientes = async () => {
    const getPacientes = await db.collection('pacientes')
      .onSnapshot(querysnapshot => {
        let table = document.getElementById('pacientes-tbody')
        table.innerHTML = ''

        //loop de la consulta de todos los pacientes
        querysnapshot.forEach((doc) => {

          let data = doc.data();
          console.log("doc.id: ", doc.id);
          let row = `<tr> 
                            <td class="td-id-hidden">${doc.id}</td>                          
                            <td>${data.nombre}</td>
                            <td>${data.apellido}</td>
                            <td>${data.edad}</td>
                             <td>${data.cedula}</td>
                            <td>${data.celular}</td>
                            <td class="ver-paciente">                             
                              <button class="td-btn" id="btn-control-paciente" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                               Control
                             </button>
                              <button  class="td-btn" id="btn-ver-paciente" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                               Editar
                             </button>
                               </button>
                              <button  class="td-btn" id="btn-eliminar-paciente" data-id=${doc.id}>
                               Eliminar
                             </button>
                            </td>
                      </tr>`;
          table.innerHTML += row

          //seleccionar todos los botones de la tabla
          const btnVerPaciente = document.querySelectorAll(".td-btn");
          //loop de botones de la tabla
          btnVerPaciente.forEach((boton) => {
            boton.addEventListener('click', (e) => {
              pacienteSeleccionado = e.target.dataset.id;
              localStorage.setItem('pacienteActual', JSON.stringify(pacienteSeleccionado));
              localStorage.setItem('nombrePaciente', JSON.stringify(e.target.dataset.nom));
              localStorage.setItem('apellidoPaciente', JSON.stringify(e.target.dataset.ape));
              console.log("ID-SELECCIONADO: ", e.target.dataset.id)

              if (e.target.id == "btn-ver-paciente") {
                window.open('editarpaciente.html');
              }
              if (e.target.id == "btn-control-paciente") {
                window.open('controlasistencias.html');
              }
              if (e.target.id == "btn-eliminar-paciente") {
                deleteAsistencia(pacienteSeleccionado);
              }
            });
          });//fin del  forEach para loop de todos los botones de la table

        }) //Fin del forEach del querysnapshot (loop de la consulta de todos los pacientes)




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

async function deleteAsistencia(id) {

  const controlAsist = await db.collection('controlasistencias')
    .where('idPaciente', '==', id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        controlActual = doc.id;
            

      });     
    })
    .catch((error) => {
      console.log("Error al Eliminar Controles de Asistencia: ", error);
    });



  const eliminar = confirm("Esta Seguro que quiere Eliminar este Paciente?");
  if (eliminar) {
    await db.collection("pacientes").doc(id).delete();
    await db.collection("controlasistencias").where('idPaciente', '==', id)
      .delete();
  }



}



