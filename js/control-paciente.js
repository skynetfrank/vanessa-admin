const historia = document.getElementById("control-form");
const tituloModo=document.querySelector("h1.control");
console.log("h1.control: ",tituloModo);
const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const controlContainer = document.getElementById('myCarusel');
const btnAddControl = document.getElementById("add-control-img");
const btnEditControl = document.getElementById("edit-control-img");
const btnDeleteControl = document.getElementById("delete-control-img");
const sliderContainer = document.querySelector(".slider-container");
const divAddControl = document.getElementById("div-control-asistencia");
const divOdontograma = document.getElementById("div-odontograma");
const btnVolver = document.getElementById("tiny-btn");
let controlActual = '';
let controlSeleccionadoSlider = '';
let modo = '';

let fechaActual = '';
let tratamientoActual = '';
let formaPagoActual = '';
let referenciaActual = '';
let montoPagadoActual = '';



//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let xfecha = new Date(cfecha);
  console.log("xfecha:", xfecha);
  let year = cfecha.getFullYear();                        // YYYY
  let month = ("0" + (cfecha.getMonth() + 1)).slice(-2);  // MM
  let day = ("0" + cfecha.getDate()).slice(-2);           // DD
  return (year + "-" + month + "-" + day);
}


function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}


function yyyymmdd(fecha) {
  let ano = fecha.substring(6);
  let mes = fecha.substring(3).slice(0, -5);
  let dia = fecha.slice(0, -8);
  return (ano + "-" + mes + "-" + dia);
}

window.addEventListener('resize', () => {
  console.log("Resized window listener");
  var elems = document.querySelectorAll('.carousel');
  var instances = M.Carousel.init(elems, {
    indicators: true,
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  document.querySelector(".very-small-btn").style.display = "none";
  //activando carousel a futuro
  var sels = document.querySelectorAll('select');
  var selects = M.FormSelect.init(sels, {});

  const snopshot = await db.collection('pacientes').doc(idPacienteLocal).get();
  const data = snopshot.data();
  document.getElementById('span-chip-paciente').innerText = data.nombre + " " + data.apellido;
  //AQUI INICIA EL LOOP PARA OBTENER CONTROLES DE ASISTENCIA

  const controlAsist = await db.collection('controlasistencias')
    .orderBy("createdAt", "desc")
    .where('idPaciente', '==', idPacienteLocal)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        controlActual = doc.id;

        controlContainer.innerHTML += `      
              <div class="carousel-item amber black-text" >
                   <div class="card amber"  data-idcontrol=${doc.id}>
                  
                        <div class="card-content black-text">
                             ${doc.data().esCita1 ? 'primera cita' : ''}
                             <span class="card-title" id="fecha-control" >Asistencia del: ${formatearFecha(doc.data().fecha)}</span>
                             <p class="textoformato" id="p-tratamiento">Tratamiento Aplicado y/o Observaciones</p>
                             <textarea  rows="5" id="text-tratamiento" disabled>${doc.data().tratamientoAplicado}</textarea>
                        </div>
                        
                        <div id="pago-titulo">
                             <span class="pago-titulo">Pago</span>
                             <span class="pago-titulo">Concepto</span>
                             <span class="pago-titulo">Banco</span>
                             <span class="pago-titulo">Referencia</span>
                             <span class="pago-titulo">Monto Bs</span>
                             <span class="pago-titulo">Monto US$</span>
                        </div>
                         <div id="pago-info">
                             <span>${doc.data().pago}</span>
                             <span>${doc.data().pago}</span>
                             <span>${doc.data().pago}</span>
                             <span>${doc.data().referencia}</span>
                             <span>${doc.data().monto}</span>   
                             <span>${doc.data().pago}</span>
                        </div>
                   </div>        
              </div>
              `
      });
      var elems = document.querySelectorAll('.carousel');

      var instances = M.Carousel.init(elems, {
        indicators: true,
        height: 100,
        onCycleTo: function () {
          for (let index = 0; index < this.images.length; index++) {
            const element = this.images[index];

            if (element.className === 'carousel-item amber black-text active') {
              controlSeleccionadoSlider = element.children[0].dataset.idcontrol;
              fechaActual = yyyymmdd((element.children[0].children[0].children[0].innerHTML).substring(16));

              tratamientoActual = (element.children[0].children[0].children[2].innerHTML);
              formaPagoActual = (element.children[0].children[1].children[0].innerHTML).substring(15);
              referenciaActual = (element.children[0].children[1].children[1].innerHTML).substring(12);
              montoPagadoActual = (element.children[0].children[1].children[2].innerHTML).substring(7);

              console.log("ID Control Asistencia Actual", controlSeleccionadoSlider);
              console.log("Fecha", fechaActual);
              console.log("Tratamiento", tratamientoActual);
              console.log("Forma Pago... ", formaPagoActual);
              console.log("Referencia", referenciaActual);
              console.log("Monto", montoPagadoActual);
              console.log("Elemento", element.children[0].children[0].children[2].innerHTML);
            }
          }
        }
      });

    })
    .catch((error) => {
      console.log("ERROR FIREBASE DEL SLIDER: ", error.message);
      if (error) {
        controlContainer.innerHTML += `      
              <div class="carousel-item amber black-text" >
                   <div class="card amber">
                        <h5>No Hay Datos Disponibles Para Mostrar</h5>
                        <div class="card-content black-text">
                            <img src="images/dberror-icon.png" alt="img" />
                        </div>                        
                   </div>        
              </div>
              `
        var elems = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(elems, {
          indicators: true,
        });
      }
    });
});





btnAddControl.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector("banner.nuevo").style.background="green";
  tituloModo.innerHTML="Agregar Control de Asistencia";
  btnVolver.style.display = "block";
  sliderContainer.style.display = "none";
  document.getElementById('crud-control-asistencia').style.display = "none";
  divAddControl.style.display = "block";
  document.querySelector(".btn-block.control").style.display = "block";
  historia['fechacontrolasistencia'].value = '';
  historia['textcontrolasistencia'].value = '';
  historia['formadepago'].value = '';
  historia['referenciapago'].value = '';
  historia['montopagado'].value = '';
  const mySelect = document.getElementById('formadepago');
  var instance = M.FormSelect.getInstance(mySelect);
  instance.input.value = '';
  modo = "new";
});


btnEditControl.addEventListener('click', (e) => {
  e.preventDefault();
  const mySelect = document.getElementById('formadepago');
  var instance = M.FormSelect.getInstance(mySelect);

  console.log("select instance: ", instance.input.value);
  btnVolver.style.display = "block";
  sliderContainer.style.display = "none";
  document.getElementById('crud-control-asistencia').style.display = "none";
  divAddControl.style.display = "block";
  document.querySelector(".btn-block.control").style.display = "block";
  modo = "update";
  console.log("Clicked on Edit modo: ", modo)
  historia['fechacontrolasistencia'].value = fechaActual;
  historia['textcontrolasistencia'].value = tratamientoActual;
  instance.input.value = formaPagoActual;
  console.log("edit clicked: instance forma pago:",instance.input.value);
  console.log("edit clicked: formapagpactual:",formaPagoActual);
  //historia['formadepago'].value = formaPagoActual;
  //element.setAttribute('style', 'display:inline !important');
  document.querySelector("label[for=referenciapago]").classList.add('active');
  document.querySelector("label[for=montopagado]").classList.add('active');

  historia['referenciapago'].value = referenciaActual;
  historia['montopagado'].value = montoPagadoActual;

});


btnVolver.addEventListener('click', (e) => {
  e.preventDefault();
  divAddControl.style.display = "none";
  document.querySelector(".btn-block.control").style.display = "none";
  document.querySelector(".very-small-btn").style.display = "none";
  sliderContainer.style.display = "block";
  document.getElementById('crud-control-asistencia').style.display = "flex";



});







historia.addEventListener('submit', async (e) => {
  e.preventDefault();


  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const textcontrolasistencia = historia['textcontrolasistencia'].value;
  const formadepago = historia['formadepago'].value;
  console.log("submitted formadepago: ",formadepago);
  const referenciapago = historia['referenciapago'].value;
  const montopagado = historia['montopagado'].value;
  //Esta es una Root Coleccion para hacer Join con Pacientes
  const controlAsistencia = {
    idPaciente: idPacienteLocal,
    fecha: fechacontrolasistencia,
    tratamientoAplicado: textcontrolasistencia,
    pago: formadepago ? formadepago:formaPagoActual,
    referencia: referenciapago,
    monto: montopagado,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };





  console.log("controlasistencias ID Documento => ", controlAsistencia);
  console.log("controlasistencias ID Documento => ", controlActual);

  if (modo === "update") {
    delete controlAsistencia.createdAt
    console.log("objeto: ",controlAsistencia);
    await db.collection('controlasistencias').doc(controlSeleccionadoSlider).update(controlAsistencia)
      .then(result => alert("control agregado ok"))
      .catch(error => alert(error));

  }

  if (modo === "new") {
    await db.collection('controlasistencias').add(controlAsistencia)
      .then(result => alert("control agregado ok"))
      .catch(error => alert(error));
  }





  /* await db.collection('controlasistencias').add(controlAsistencia)
    .then(result => alert("control agregado ok"))
    .catch(error => alert(error)); */




  historia.reset();

  divAddControl.style.display = "none";
  document.querySelector(".btn-block.control").style.display = "none";
  document.querySelector(".very-small-btn").style.display = "none";
  sliderContainer.style.display = "block";
  btnAddControl.style.display = "block";
  fechaActual = '';
  tratamientoActual = '';
  formaPagoActual = '';
  referenciaActual = '';
  montoPagadoActual = '';
  controlSeleccionadoSlider = '';
  modo = '';



  window.location.reload();


});


//CRUD CONTROL DE ASISTENCIAS
controlContainer.addEventListener('dragged', () => {
  console.log("Se ha producido un scroll y el control ha cambiado");
});
















btnDeleteControl.addEventListener('click', async () => {
  let confirmado = confirm('Esta Seguro que desea eliminar este Control de Asistencia?:');

  if (confirmado) {
    await db.collection('controlasistencias').doc(controlSeleccionadoSlider)
      .delete()
      .then(resp => alert("Se ha Eliminado el Control de Asistencia Seleccionado"))
      .catch(error => console.log("error al eliminar cita! verifique..."));
    window.location.reload();
  } else {
    return false;
  }
});

