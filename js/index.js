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
const buscador = document.querySelector(".search__input");
const btnBorrar = document.getElementById("btn-borrar");
const dashboard = document.getElementById("link-dashboard");

let textoBusqueda = "";
var pacientex = [];

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  console.log("cfecha:", cfecha);
  let year = cfecha.getFullYear();                        // YYYY
  let month = ("0" + (cfecha.getMonth() + 1)).slice(-2);  // MM
  let day = ("0" + cfecha.getDate()).slice(-2);           // DD
  return (year + "-" + month + "-" + day);
}

function autoCapital(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}


function populateTabla() {

  const allPacientes = async () => {
    const getPacientes = await db.collection('pacientes')
      .orderBy("nombre", 'asc')
      .onSnapshot(querysnapshot => {
        let table = document.getElementById('pacientes-tbody')
        table.innerHTML = ''

        //loop de la consulta de todos los pacientes
        querysnapshot.forEach((doc) => {

          let data = doc.data();
          console.log(data);
          let row = `<tr> 
                        <td class="td-id-hidden">${doc.id}</td>                          
                        <td>${data.nombre}</td>
                        <td>${data.apellido}</td>
                        <td>${data.edad}</td>
                        <td>${data.celular}</td>
                        <td class="ver-paciente">                      
                           <button class="td-btn" id="btn-control-paciente" data-tip="Control de Asistencia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                           <i class="fas fa-tasks"></i>
                           </button>                       
                           <button  class="td-btn" id="btn-odograma" data-tip="Ver/Editar Odograma" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                            <i class="fas fa-teeth-open"></i>
                           </button>   
                           <button  class="td-btn" id="btn-ver-paciente" data-tip="Editar Historia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                            <i class="fas fa-pencil-alt"></i>
                           </button>
                           <button  class="td-btn" id="btn-eliminar-paciente" data-tip="Eliminar este Paciente" data-id=${doc.id}>
                             <i class="fas fa-user-times"></i>
                           </button>
                        </td>
                     </tr>`;

          //filtrar datos en base al buscador  

          if (textoBusqueda.length > 0) {
            if (data.nombre.trim() === textoBusqueda.trim() || data.apellido.trim() === textoBusqueda.trim()) {
              table.innerHTML += row
            }
          } else {
            table.innerHTML += row
          }



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
              if (e.target.id == "btn-odograma") {
                window.open('odograma.html');
              }
              if (e.target.id == "btn-eliminar-paciente") {
                deleteAsistencia(pacienteSeleccionado);
              }
            });
          });//fin del  forEach para loop de todos los botones de la table

        }) //Fin del forEach del querysnapshot (loop de la consulta de todos los pacientes)




        /*  if (table.innerHTML === '') {
           document.getElementById("mostrar-citas").style.display = "none";
         } */

      });
  }
  allPacientes();


};


dashboard.addEventListener('click', () => {
  agenda.style.pointerEvents = 'all';

  document.getElementById("section-crear-paciente").style.display = "none"
  document.getElementById("pacientes").style.display = "none"
  document.getElementById("myTimeline").style.display = "none"
  navLinks.classList.toggle('active');
  window.open('dashboard.html');
});


//FUNCION PARA DESPLEGAR AGENDA POP-UP
(function () {
  "use strict";
  var items = document.querySelectorAll(".timeline li");

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    var items = document.querySelectorAll(".timeline li");
    for (var i = 0; i < items.length; i++) {
      console.log("i: ", i);
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      } else {
        items[i].classList.remove("in-view");
      }
      if (i == 0) {
        items[i].classList.add("in-view");
      }
    }//end of for
  }
  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

})();
//FIN DE FUNCION PARA DESPLEGAR AGENDA POP-UP


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

//ACTIVAR EL MENU HAMBURGUESA
toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
})


//VOLVER AL MENU DE INICIO CLICKEANDO EL LOGO
document.getElementById("img-logo").addEventListener("click", () => {
  document.getElementById("pacientes").style.display = "none"
  document.getElementById("inicio").style.display = "inline-block"
  document.getElementById("myTimeline").style.display = "none"
});



buscador.addEventListener('change', (e) => {
  textoBusqueda = autoCapital(e.target.value);
  if (textoBusqueda) {
    btnBorrar.style.display = "initial";
  }
  populateTabla();
});

btnBorrar.addEventListener('click', () => {
  buscador.value = '';
  textoBusqueda = '';
  btnBorrar.style.display = "none";
  populateTabla();
})



//CONSULTAR TODOS LOS PACIENTES
paciente.addEventListener('click', (ev) => {
  agenda.style.pointerEvents = 'all';
  document.getElementById("section-crear-paciente").style.display = "none"
  document.getElementById("inicio").style.display = "none"
  document.getElementById("myTimeline").style.display = "none"
  document.getElementById("pacientes").style.display = "inline-block"
  window.scrollTo(0, 0);
  navLinks.classList.toggle('active');
  ev.preventDefault();

  populateTabla();





});//FIN DEL LISTENER PACIENTES


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
}//FIN DE DELETEASISTENCIA



//INICIO DEL LISTENER PARA LA AGENDA
agenda.addEventListener('click', () => {
  agenda.style.pointerEvents = 'none';
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

    let fecha = convertirFecha(new Date());
    const allcitas = await db.collection('citas')
      .where('fecha', '>=', fecha)
      .orderBy('fecha', "asc")
      .orderBy('hora', "asc")
      .onSnapshot(querysnapshot => {
        timeLista.innerHTML = '';
        querysnapshot.forEach((doc) => {
          let data = doc.data();
          const found = pacientex.find(p => p.id === data.paciente);

          let fila = `<li>
          <div>
              <button style="display: block" class="btn-eliminar-cita">X</button>
              <time>Dia: ${formatearFecha(data.fecha)}
                    Hora: ${data.hora}</time><time>Paciente: ${found.nombre} ${found.apellido}
              </time>
              Mensaje: ${data.msg}  
              <span id="id-cita-eliminar">${doc.id}</span>         
          </div>
          </li>`
          timeLista.innerHTML += fila;


          //seleccionar todos los botones eliminar cita
          const allCitas = document.querySelectorAll(".btn-eliminar-cita");
          //loop de botones de la tabla
          allCitas.forEach((boton) => {
            boton.addEventListener('click', async (e) => {
              //pacienteSeleccionado = e.target.dataset.id;
              let idCita = e.target.parentNode.parentNode.querySelector('span').innerHTML;
              console.log("ID-CITA: ", idCita)
              await db.collection("citas").doc(idCita)
                .delete()
                .then(resp => alert("Cita Eliminada!"))
                .catch(error => console.log("error al eliminar cita! verifique..."));


            });
          });//fin del  forEach para loop de todos los botones de la table

        })//fin del forEach para todas las citas
      });//fin de onSnapshot
  }//fin de getcitas()
  getCitas();
});//FINDE LISTENER PARA AGENDA


//Eliminar 1 cita 
document.getElementById("ul-timeline").addEventListener('click', (e) => {
  e.preventDefault();

  // console.log("li target", e.target.parentNode.parentNode.querySelector('li div span'))
  /*  const id_cita = e.target.parentNode.parentNode.querySelector('td:nth-child(1)').innerHTML;
   db.collection("citas").doc(id_cita)
     .delete()
     .then()
     .catch(error => console.log("error al eliminar cita! verifique...")); */

});
