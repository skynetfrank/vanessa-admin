const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navLinks = document.getElementsByClassName('navLinks')[0];
const agenda = document.getElementById('link-agenda');
const paciente = document.getElementById('link-paciente');
const dashboard = document.getElementById('link-dashboard');
const sitioWeb = document.getElementById('link-sitioweb');
const usuarioActual = document.getElementById('usuario');
const mostrarData = document.getElementById('div__mostrar');
const btnVerHistoria = document.getElementById('btn-ver-paciente');
const btnCrearPaciente = document.getElementById('img-crear-paciente');
const buscador = document.querySelector('.search__input');
const btnBorrar = document.getElementById('btn-borrar');
const btnUpdateAgenda = document.getElementById('update-agenda');

let textoBusqueda = '';
var pacientex = [];

//funcion para convertir fecha a formato DD-MM-AAAA
function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('-');
  return info;
}

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let year = cfecha.getFullYear(); // YYYY
  let month = ('0' + (cfecha.getMonth() + 1)).slice(-2); // MM
  let day = ('0' + cfecha.getDate()).slice(-2); // DD
  return year + '-' + month + '-' + day;
}

function autoCapital(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

function populateTabla() {
  const allPacientes = async () => {
    const getPacientes = await db
      .collection('pacientes')
      .orderBy('nombre', 'asc')
      .onSnapshot(querysnapshot => {
        let table = document.getElementById('pacientes-tbody');
        table.innerHTML = '';

        //loop de la consulta de todos los pacientes
        querysnapshot.forEach(doc => {
          let data = doc.data();

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
            if (
              data.nombre.trim() === textoBusqueda.trim() ||
              data.apellido.trim() === textoBusqueda.trim()
            ) {
              table.innerHTML += row;
            }
          } else {
            table.innerHTML += row;
          }

          //seleccionar todos los botones de la tabla
          const btnVerPaciente = document.querySelectorAll('.td-btn');
          //loop de botones de la tabla
          btnVerPaciente.forEach(boton => {
            boton.addEventListener('click', e => {
              pacienteSeleccionado = e.target.dataset.id;
              localStorage.setItem(
                'pacienteActual',
                JSON.stringify(pacienteSeleccionado)
              );
              localStorage.setItem(
                'nombrePaciente',
                JSON.stringify(e.target.dataset.nom)
              );
              localStorage.setItem(
                'apellidoPaciente',
                JSON.stringify(e.target.dataset.ape)
              );

              if (e.target.id == 'btn-ver-paciente') {
                window.open('editarpaciente.html');
              }
              if (e.target.id == 'btn-control-paciente') {
                window.open('controlasistencias.html');
              }
              if (e.target.id == 'btn-odograma') {
                window.open('odograma.html');
              }
              if (e.target.id == 'btn-eliminar-paciente') {
                deleteAsistencia(pacienteSeleccionado);
              }
            });
          }); //fin del  forEach para loop de todos los botones de la table
        }); //Fin del forEach del querysnapshot (loop de la consulta de todos los pacientes)
      });
  };
  allPacientes();
} //FIN DE POPULATE TABLA

dashboard.addEventListener('click', () => {
  agenda.style.pointerEvents = 'all';
  document.getElementById('section-crear-paciente').style.display = 'none';
  document.getElementById('pacientes').style.display = 'none';
  document.getElementById('myTimeline').style.display = 'none';
  navLinks.classList.toggle('active');
  window.open('dashboard.html');
});

//FUNCION PARA DESPLEGAR AGENDA POP-UP
(function () {
  'use strict';
  var items = document.querySelectorAll('.timeline li');

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
    var items = document.querySelectorAll('.timeline li');
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add('in-view');
      } else {
        items[i].classList.remove('in-view');
      }
      if (i == 0) {
        items[i].classList.add('in-view');
      }
    } //end of for
  }
  // listen for events
  window.addEventListener('load', callbackFunc);
  window.addEventListener('resize', callbackFunc);
  window.addEventListener('scroll', callbackFunc);
})();
//FIN DE FUNCION PARA DESPLEGAR AGENDA POP-UP

auth.onAuthStateChanged(async user => {
  if (user) {
    usuarioActual.innerHTML = 'Administrador: ' + user.email;
    document.getElementById('loginId').style.display = 'none';
    document.getElementById('logout').style.display = 'block';

    document.querySelectorAll('i.left').forEach(icon => {
      icon.style.color = 'rgb(4, 167, 167)';
    });

    document.querySelectorAll('.menu').forEach(elemento => {
      elemento.style.pointerEvents = 'all';
      elemento.style.color = 'black';
    });
    populateTabla();
  } else {
    console.log('auth change...no hay usuario');
    document.getElementById('pacientes').style.display = 'none';
    document.getElementById('inicio').style.display = 'inline-block';
    document.getElementById('myTimeline').style.display = 'none';

    document.querySelectorAll('.menu').forEach(elemento => {
      elemento.style.pointerEvents = 'none';
      elemento.style.color = 'rgb(194, 189, 189)';
    });
    document.querySelectorAll('.img-menu').forEach(icon => {
      icon.style.pointerEvents = 'none';
    });
  }
});

//ACTIVAR EL MENU HAMBURGUESA
toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

//VOLVER AL MENU DE INICIO CLICKEANDO EL LOGO
document.getElementById('img-logo').addEventListener('click', () => {
  document.getElementById('pacientes').style.display = 'none';
  document.getElementById('inicio').style.display = 'inline-block';
  document.getElementById('myTimeline').style.display = 'none';
});

buscador.addEventListener('change', e => {
  textoBusqueda = autoCapital(e.target.value);
  if (textoBusqueda) {
    btnBorrar.style.display = 'initial';
  }
  populateTabla();
});

btnBorrar.addEventListener('click', () => {
  buscador.value = '';
  textoBusqueda = '';
  btnBorrar.style.display = 'none';
  populateTabla();
});

//CONSULTAR TODOS LOS PACIENTES
paciente.addEventListener('click', ev => {
  agenda.style.pointerEvents = 'all';
  document.getElementById('section-crear-paciente').style.display = 'none';
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('myTimeline').style.display = 'none';
  document.getElementById('pacientes').style.display = 'inline-block';
  window.scrollTo(0, 0);

  navLinks.classList.toggle('active');
  ev.preventDefault();

  //Toast.show("esto es un toast-message de prueba");

  
}); //FIN DEL LISTENER PACIENTES

/* btnCrearPaciente.addEventListener('click', () => {
  document.getElementById('pacientes').style.display = 'none';
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('myTimeline').style.display = 'none';
  document.getElementById('section-crear-paciente').style.display = 'initial';
});
 */
async function deleteAsistencia(id) {
  const controlAsist = await db
    .collection('controlasistencias')
    .where('idPaciente', '==', id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        controlActual = doc.id;
      });
    })
    .catch(error => {
      console.log('Error al Eliminar Controles de Asistencia: ', error);
    });

  const eliminar = confirm('Esta Seguro que quiere Eliminar este Paciente?');
  if (eliminar) {
    await db.collection('pacientes').doc(id).delete();
    await db
      .collection('controlasistencias')
      .where('idPaciente', '==', id)
      .delete();
  }
} //FIN DE DELETEASISTENCIA

//INICIO DEL LISTENER PARA LA AGENDA
agenda.addEventListener('click', () => {
  horario();
  window.scroll(0, 3);
  agenda.style.pointerEvents = 'none';
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('section-crear-paciente').style.display = 'none';
  document.getElementById('pacientes').style.display = 'none';
  document.getElementById('myTimeline').style.display = 'initial';
  navLinks.classList.toggle('active');

  let timeLista = document.getElementById('ul-timeline');

  db.collection('users')
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(paciente => {
        let currentID = paciente.id;
        let appObj = { ...paciente.data(), ['id']: currentID };
        pacientex.push(appObj);
      });
    });

  const getCitas = async () => {
    let fecha = convertirFecha(new Date());
    const allcitas = await db
      .collection('citas')
      .where('fecha', '>=', fecha)
      .orderBy('fecha', 'asc')
      .orderBy('hora', 'asc')
      .onSnapshot(querysnapshot => {
        timeLista.innerHTML = '';
        querysnapshot.forEach(doc => {
          let data = doc.data();
          const found = pacientex.find(p => p.id === data.paciente);

          let fila = `<li>
          <div>
              <button style="display: block" class="btn-eliminar-cita td-btn" data-tip="Eliminar Esta Cita">
              <i class="far fa-trash-alt"></i>
              </button>
              <time>Dia: ${formatearFecha(data.fecha)}
                    Hora: ${data.hora}</time><time>
                    Paciente: ${
                      data.status === 'Bloqueada'
                        ? 'Cita Bloqueda por la Dra.'
                        : found.nombre + ' ' + found.apellido
                    }
              </time>
              Mensaje: ${data.msg}   
              <span id="id-cita-eliminar">${doc.id}</span>         
          </div>
          </li>`;
          timeLista.innerHTML += fila;

          window.scroll(0, 1);
          //seleccionar todos los botones eliminar cita
          const allButtons = document.querySelectorAll('.btn-eliminar-cita');
          //loop de botones de la tabla
          allButtons.forEach(boton => {
            boton.addEventListener('click', async e => {
              let idCita =
                e.target.parentNode.parentNode.querySelector('span').innerHTML;
              await db
                .collection('citas')
                .doc(idCita)
                .delete()
                .then(resp => console.log('Cita Eliminada!'))
                .catch(error =>
                  console.log('error al eliminar cita! verifique...')
                );
              agenda.click();
            });
          }); //fin del  forEach para loop de todos los botones de la table
        }); //fin del forEach para todas las citas
      }); //fin de onSnapshot
  }; //fin de getcitas()
  getCitas();
}); //FINDE LISTENER PARA AGENDA

btnUpdateAgenda.addEventListener('click', e => {
  e.preventDefault();
  agenda.click();
});

//funcion para obtener el resto de horas que quedan sin apartar en el dia
async function horario() {
  const fecha = convertirFecha(new Date()); //fecha de hoy
  const listaHoras = document.getElementById('listaHoras');
  //array de horas por defecto de 7 a 7 (formato militar)
  var horas = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  await db
    .collection('citas')
    .where('fecha', '==', fecha)
    .onSnapshot(querySnapshot => {
      console.log('onSnapshot disparado', querySnapshot);
      listaHoras.innerHTML = `
      <div class="titulo-horas">
      <li>Horas de Citas</li>
      <li>Disponibles Hoy</li>
      <li>${formatearFecha(fecha)}</li>
      </div>     
      `;
      querySnapshot.forEach(doc => {
        let position = horas.indexOf(doc.data().hora);
        if (position >= 0) {
          horas.splice(position, 1);
        }
      });
      horas.forEach(item => {
        if (item.length > 0) {
          listaHoras.innerHTML += `
        <li>${item}
            <button class="td-btn horas" data-tip="Bloquear Hora">
                 <i class="fas fa-user-alt-slash"></i>
            </button>                  
        </li>`;
        }
      });

      //seleccionar todos los botones eliminar cita
      const allHoras = document.querySelectorAll('.td-btn.horas');
      //loop de botones de la tabla
      allHoras.forEach(boton => {
        boton.addEventListener('click', e => {
          let horaX = e.target.parentNode.innerHTML.substring(0, 5);
          bloquearHora(fecha, horaX);
        });
      }); //fin del  forEach para loop de todos los botones de la table
    });
} //END OF HORARIO()

async function bloquearHora(fechaBloquear, horaBloquear) {
  await db.collection('citas').doc().set({
    fecha: fechaBloquear,
    hora: horaBloquear,
    telefono: 'Dra. Vanessa',
    msg: 'Para desbloquear pulsa el boton!',
    paciente: auth.currentUser.uid,
    status: 'Bloqueada',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  window.scroll(0, 2);
}

sitioWeb.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  window.open('https://od-vanessamijares.ml', '_blank');
});
