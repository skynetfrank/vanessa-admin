const historia = document.getElementById("control-form");
const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const controlContainer = document.getElementById('myCarusel');
const btnAddControl = document.getElementById("add-control-img");
const sliderContainer = document.querySelector(".slider-container");
const divAddControl = document.getElementById("div-control-asistencia");
const divOdontograma = document.getElementById("div-odontograma");
const btnVolver = document.getElementById("tiny-btn");
let controlActual = '';

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

window.addEventListener('resize', () => {
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
    .where('idPaciente', '==', idPacienteLocal)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        controlActual = doc.id;
        console.log("controlasistencias forEach doc => ", doc.data());

        controlContainer.innerHTML += `      
<div class="carousel-item amber black-text">
        <div class="card amber">
          <div class="card-content black-text">
            <span class="card-title">Historial: ${formatearFecha(doc.data().fecha)}</span>
            <p class="textoformato" >Tratamiento Aplicado</p>
            <textarea  rows="5" id="text-tratamiento" disabled>${doc.data().tratamientoAplicado}</textarea>
          </div>
         <div id="pago-info">
              <span>Pago: ${doc.data().pago}</span>
              <span>Ref: ${doc.data().referencia}</span>
              <span>Monto: ${doc.data().monto}</span>
         </div>
       </div>        
 </div>
       `

      });
      var elems = document.querySelectorAll('.carousel');

      var instances = M.Carousel.init(elems, {
        indicators: true,
        height: 100,
      });
    })
    .catch((error) => {
      console.log("Error getting controles de asistencia: ", error);
    });
});





btnAddControl.addEventListener('click', (e) => {
  e.preventDefault();
  btnVolver.style.display = "block";
  sliderContainer.style.display = "none";
  btnAddControl.style.display = "none";
  divAddControl.style.display = "block";
  document.querySelector(".btn-block.control").style.display = "block";
  divOdontograma.style.display = "flex";
});

btnVolver.addEventListener('click', (e) => {
  e.preventDefault();
  divAddControl.style.display = "none";
  document.querySelector(".btn-block.control").style.display = "none";
  document.querySelector(".very-small-btn").style.display = "none";
  sliderContainer.style.display = "block";
  btnAddControl.style.display = "block";
});







historia.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const textcontrolasistencia = historia['textcontrolasistencia'].value;
  const formadepago = historia['formadepago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = historia['montopagado'].value;
  //Esta es una Root Coleccion para hacer Join con Pacientes
  const controlAsistencia = {
    idPaciente: idPacienteLocal,
    fecha: fechacontrolasistencia,
    tratamientoAplicado: textcontrolasistencia,
    pago: formadepago,
    referencia: referenciapago,
    monto: montopagado,
  };
  console.log("controlasistencias ID Documento => ", controlAsistencia);
  console.log("controlasistencias ID Documento => ", controlActual);
  await db.collection('controlasistencias').add(controlAsistencia)
    .then(result => alert("control agregado ok"))
    .catch(error => alert(error));
  historia.reset();
  divAddControl.style.display = "none";
  document.querySelector(".btn-block.control").style.display = "none";
  document.querySelector(".very-small-btn").style.display = "none";
  sliderContainer.style.display = "block";
  btnAddControl.style.display = "block";


});



