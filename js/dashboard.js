const dashMenu = document.querySelectorAll(".dash-sidebar-menu");
const instagramLink = document.getElementById("dash-instagram-div");
const cardIngresos = document.getElementById("total-ingresos");
const cardActividad = document.getElementById("total-procedimientos");
const cardPacientes = document.getElementById("total-pacientes");
const cardCitas = document.getElementById("total-citas");
const btnPacientes = document.getElementById("btn-pacientes");
const btnAgenda = document.getElementById("btn-agenda");
const btnSalir = document.getElementById("btn-salir");
const btnGeneral = document.getElementById("btn-general");
const btnDescargarExcel = document.getElementById("btn-descargar-excel");





let ingresos = 0;
var pacientex = [];

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let year = cfecha.getFullYear();                        // YYYY
  let month = ("0" + (cfecha.getMonth() + 1)).slice(-2);  // MM
  let day = ("0" + cfecha.getDate()).slice(-2);           // DD
  return (year + "-" + month + "-" + day);
}

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}


window.addEventListener('load', async () => {
  await db.collection('pacientes')
    .onSnapshot(queryPacientes => {
      cardPacientes.innerHTML = queryPacientes.docs.length;
    });

  await db.collection('citas')
    .onSnapshot(queryCitas => {
      cardCitas.innerHTML = queryCitas.docs.length;
    });

  await db.collection('controlasistencias')
    .onSnapshot(queryActividad => {
      cardActividad.innerHTML = queryActividad.docs.length;
      ingresos = 0;

      queryActividad.forEach((actividad) => {
        let thenum = actividad.data().monto.replace(/\D/g, '');
        ingresos += Number(thenum);

      })
      //cardIngresos.innerHTML = ingresos.toLocaleString('en-US', { minimumFractionDigits: 2 });
      cardIngresos.innerHTML = 'US$ 0.00';
    });


  btnGeneral.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });

  btnPacientes.addEventListener("click", () => {
    window.scrollTo(0, 160);
  });

  btnSalir.addEventListener("click", () => {
    window.close();
  });


  //CITAS PENDIENTES DASHBOARD

  let divCitasPendientes = document.querySelector(".dash-card.customer");
  db.collection('users').get()
    .then(snapshot => {
      snapshot.docs.forEach(paciente => {
        let currentID = paciente.id
        let appObj = { ...paciente.data(), ['id']: currentID }
        pacientex.push(appObj)
      })
    });

  const getCitasPendientes = async () => {
    console.log("getCitasPendientes ejecutandose");
    let fecha = convertirFecha(new Date());
    const allcitas = await db.collection('citas')
      .where('fecha', '>=', fecha)
      .orderBy('fecha', "asc")
      .orderBy('hora', "asc")
      .onSnapshot(querysnapshot => {
        divCitasPendientes.innerHTML = '<h1>AGENDA</h1> <h2>Citas Pendientes</h2>';
        querysnapshot.forEach((doc) => {
          let data = doc.data();
          const found = pacientex.find(p => p.id === data.paciente);

          let divCita = `
           <div class="dash-customer-wrapper">
              <img class="dash-customer-image" src="images/watch-icon.png" alt="img">
              <div class="dash-customer-name">
              <h4>${found.nombre} ${found.apellido}</h4>
              <p>Dia: ${formatearFecha(data.fecha)}</p>
              <p>Hora: ${data.hora}</p>
              <p>${data.msg}</p>             
           </div>
        </div>          
          `
          divCitasPendientes.innerHTML += divCita;


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
  getCitasPendientes();



  //FIN DE CITAS PENDIENTES DASHBOAR


})







dashMenu.forEach((menu) => {
  menu.addEventListener('click', (e) => {
    e.preventDefault();
    btnOff();
    menu.classList.toggle("active");
  })
});


instagramLink.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked")
  window.open("https://www.instagram.com/od.vanessamijares/");
})





function btnOff() {

  let comandos = document.querySelectorAll(".dash-sidebar-menu");
  console.log(comandos);
  Array.from(comandos).forEach((el) => {
    console.log("inside btnOff")
    if (el.classList.contains("active")) {
      el.classList.toggle("active");
    }
  })
}

//--------------------------------------------------------------REAL DATA ------------------------


function populateTabla() {

  const allPacientes = async () => {
    const getPacientes = await db.collection('pacientes')
      .onSnapshot(querysnapshot => {
        let table = document.getElementById('dash-pacientes-tbody')
        table.innerHTML = ''
        console.log("cantidad de pacientes: ", querysnapshot.docs.length);
        cardPacientes.innerHTML = querysnapshot.docs.length;
        //loop de la consulta de todos los pacientes
        querysnapshot.forEach((doc) => {

          let data = doc.data();
          let myAlergias = [];
          let myPersonales = [];
          let myFamiliares = [];
          data.alergias.forEach((el1) => {
            if (el1 === "") {
              console.log("Alergia vacio");
            } else {
              myAlergias.push(el1);
            }
          })

          data.antecedentesPersonales.forEach((el2) => {
            if (el2 === "") {
              console.log("antecedente Personal vacio");
            } else {
              myPersonales.push(el2);
            }
          })

          data.antecedentesFamiliares.forEach((el3) => {
            if (el3 === "") {
              console.log("Antecedente Familiar vacio");
            } else {
              myFamiliares.push(el3);
            }
          })









          let row = `<tr> 
                        <td class="td-id-hidden">${doc.id}</td> 
                        <td data-exclude="true"><img src='images/mask-icon24.png'/></td>
                        <td>${data.nombre}</td>
                        <td>${data.apellido}</td>
                        <td data-a-h="center">${data.edad}</td>
                        <td>${data.celular}</td>
                        <td class="ocultar-td">${data.tlflocal}</td>
                        <td  class="ocultar-td">${data.fnacimiento}</td>
                        <td  class="ocultar-td">${data.email}</td>
                        <td  class="ocultar-td">${data.genero}</td>
                        <td  class="ocultar-td">${data.edocivil}</td>
                        <td  class="ocultar-td">${data.direccion1}</td>
                        <td  class="ocultar-td">${data.contacto}</td>
                        <td  class="ocultar-td">${data.estatura}</td>
                        <td  class="ocultar-td">${data.peso}</td>
                        <td  class="ocultar-td">${data.tratadopormedico == "true" ? "SI" : "NO"}</td>
                        <td  class="ocultar-td">${data.tratadoporenfermedad}</td>
                        <td  class="ocultar-td">${data.checktomamedicamento == "true" ? "SI" : "NO"}</td>
                        <td  class="ocultar-td">${data.cualesmedicamentos}</td>
                        <td  class="ocultar-td">${data.dosismeds}</td>
                        <td  class="ocultar-td">${myAlergias}</td>
                        <td  class="ocultar-td">${data.textalergicootros}</td>
                        <td  class="ocultar-td">${myPersonales}</td>
                        <td  class="ocultar-td">${data.texthabitos}</td>
                        <td  class="ocultar-td">${myFamiliares}</td>
                        <td  class="ocultar-td">${data.otraenfermedad}</td>
                        <td  class="ocultar-td">${data.motivoprincipalconsulta}</td>
                        <td  class="ocultar-td">${data.fechaultimaconsulta}</td>
                        <td  class="ocultar-td">${data.motivoultimaconsulta}</td>
                        <td  class="ocultar-td">${data.checkcomplicaciones == "true" ? "SI" : "NO"}</td>
                        <td  class="ocultar-td">${data.cualescomplicaciones}</td>
                        <td  class="ocultar-td">${data.texttratamiento}</td>
                        
                        <td class="ver-paciente" data-exclude="true">                       
                           <button class="td-btn" id="btn-control-paciente" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                               <i class="fas fa-search"></i>
                           </button>                        
                        </td>
                     </tr>`;

          table.innerHTML += row;
          myAlergias = [];
          myFamiliares = [];
          myPersonales = [];
          //filtrar datos en base al buscador  

          /*  console.log("textoBusqueda Lenth =>: ", textoBusqueda.length);
           if (textoBusqueda.length > 0) {
             if (data.nombre.trim() === textoBusqueda.trim() || data.apellido.trim() === textoBusqueda.trim()) {
               table.innerHTML += row
             }
           } else {
             table.innerHTML += row
           }
  */


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

      });
  }
  allPacientes();


};

populateTabla();



btnDescargarExcel.addEventListener("click", () => {
  var mytimestamp = new Date();
  var stampid = mytimestamp.toString();

  TableToExcel.convert(document.getElementById("tabla-dash-pacientes"), {
    name: "Pacientes-" + stampid.substring(4, 15) + ".xlsx",
    sheet: {
      name: "Info-Pacientes"
    }
  });

});


function myLoop(myArray) {


}