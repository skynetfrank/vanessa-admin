const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const nombrePaciente = JSON.parse(localStorage.getItem('nombrePaciente'));
const apellidoPaciente = JSON.parse(localStorage.getItem('apellidoPaciente'));
const uploadProgress = document.getElementById("progress");
// Create a root reference
//var ref = storage.ref('images').child(idPacienteLocal + '.jpg');

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let year = cfecha.getFullYear();                        // YYYY
  let month = ("0" + (cfecha.getMonth() + 1)).slice(-2);  // MM
  let day = ("0" + cfecha.getDate()).slice(-2);           // DD
  return (year + "-" + month + "-" + day);
}
let fecha = formatearFecha(convertirFecha(new Date()));




//SETTING CONSTANTES
const MARCAR_EXTRACCION = 1;
const MARCAR_CARIES = 2;
const MARCAR_AREA = 3;
const MARCAR_FRACTURA = 4;
const LINEA_VERTICAL = 5;
const LINEA_HORIZONTAL = 6;
const DIENTE_AUSENTE = 7;
const MARCAR_BOX_UP = 8;
const MARCAR_BOX_DOWN = 9;
const MARCAR_IMPLANTE = 10;
const MARCAR_BORRAR = 11;
const MARCAR_LIMPIAR = 12;
const MARCAR_PUENTE_FIJO = 13;
const MARCAR_REMOVIBLE = 14;
const MARCAR_HIPERSENSE = 15;
const MARCAR_APICAL = 16;
const MARCAR_FISTULA = 17;
const MARCAR_EMPAQ_ALIMENTO = 18;
const MARCAR_INFRAOCLUSION = 19;
const MARCAR_PROFUNDIDAD_SONDAJE = 20;
const MARCAR_INSERSION_CLINICA = 21;
const MARCAR_SANGRAMIENTO_SONDAJE = 22;
const MARCAR_MUCOSA_MASTICADORA = 23;
const MARCAR_DEFECTO_MUCOGINGIVAL = 24;
const MARCAR_MOVILIDAD_DENTARIA = 25;
const MARCAR_COMPROMISO_FURCACION = 26;
const MARCAR_PROTESIS_DEFECTUOSA = 27;
const MARCAR_FRENILLO = 28;
const MARCAR_EXTRUSION = 29;
const MARCAR_INCLINACION = 30;
const MARCAR_ROTACION = 31;
const SIN_SELECCION = 0;

// SETTING ALL VARIABLES
var isMouseDown = false;

var isStorage = false;//switche para controlar si existe el odograma en firebase storage
var canvas = document.createElement('canvas');
var body = document.getElementsByTagName("body")[0];
var ctx = canvas.getContext('2d');
var linesArray = [];
var currentSize = 3;
var currentColor = "rgba(0, 0, 255, 0.7)";
var currentAction = SIN_SELECCION;
var currentBg = "white";
var odogramaOriginal = document.getElementById("img-hidden");
var cargarImagen = document.getElementById("cargarImg");
var recortarImagen = document.getElementById("recortarImg");
var h3 = document.getElementById("myH3");

var odograma = new Image();
//asignar ubicacion donde esta la imagen del odograma
// odograma.src = "images/odograma1.jpg";

//Verificar si existe un odograma en storage - sino crear uno nuevo
window.addEventListener('load', () => {
  var ref = storage.ref('images').child(idPacienteLocal + '.jpg');
  ref.getDownloadURL().then(function (url) {
    odograma.src = url;
    odograma.crossOrigin = "Anonymous";
    isStorage = true;
  }).catch(function (error) {

    if (error.code === 'storage/object-not-found') {
      alert("Paciente sin Odograma Anterior. Se la asignara un Odograma nuevo.");
      odograma.src = "images/odograma1.jpg";
      odograma.crossOrigin = "Anonymous";
      isStorage = false;
    }
  });
})

odograma.addEventListener('load', () => {
  createCanvas();
  if (!isStorage) {
    ctx.font = "15px Arial";
    ctx.fillStyle = '#000000'
    ctx.fillText('Paciente: ' + nombrePaciente + ' ' + apellidoPaciente + ' ' + ' ' + '  ID: ' + idPacienteLocal +
      ' ' + ' Creado el: ' + fecha, 20, 485)
  }
  document.getElementById("h2-nombre").innerHTML += ' ' + nombrePaciente + ' ' + apellidoPaciente;
  document.getElementById("marcador").focus();
});
// INITIAL LAUNCH


// CREATE CANVAS

function createCanvas() {
  canvas.id = "canvas";
  canvas.width = 600;
  canvas.height = 500;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid rgb(121, 113, 113)";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  ctx.drawImage(odograma, 0, 0);

}



document.getElementById('download').addEventListener('click', () => {
  guardarLocal(document.getElementById('saveToImage'), 'canvas', idPacienteLocal + '.jpg')
})

function guardarLocal(link, canvas, filename) {

  //link.href = document.getElementById(canvas).toDataURL("image/jpeg", 1.0);
  //link.download = filename;
  console.log("Downloaded!!", link.href, canvas, filename);
}



//boton guardar odograma en firebase
document.getElementById('saveToImage').addEventListener('click', function () {
  guardarStorage(this, 'canvas', idPacienteLocal + '.jpg');
});
//FIN GUARDAR CANVAS


// DOWNLOAD CANVAS
function guardarStorage(link, canvas, filename) {
  let ref = storage.ref('images').child(idPacienteLocal + '.jpg');
  link.href = document.getElementById(canvas).toDataURL("image/jpeg", 1.0);
  console.log("link.href: ", link.href.substring(23));
  //link.download = filename;

  //EXPERIMENTAL SAVE TO FIREBASE
  uploadTask = ref.putString(link.href.substring(23), 'base64', { contentType: 'image/jpg' });
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      console.log("snapshot: ", snapshot);
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          uploadProgress.innerHTML = "Guardando... Espere!"
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      console.log(error);
      alert("Ocurrio un error al subir la imagen al Servidor!.");
    }, function () {
      // Upload completed successfully, now we can get the download URL
      uploadProgress.innerHTML = "Odograma Guardado Correctamente!"
      alert("Se ha grabado el odograma correctamente");
      uploadProgress.innerHTML = ""
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log("downloadURL: ", uploadTask.snapshot);
    });


  function descargarStorage() {

    var ref = storage.ref('images').child('pruebaOdontograma.jpg');
    ref.getDownloadURL().then(function (url) {
      // `url` is the download URL for 'images/stars.jpg'
      console.log("url obtenido: ", url);
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element:
      var img = document.getElementById('myimg');
      img.src = url;
    }).catch(function (error) {
      // Handle any errors
    });

  }






  //FIN EXPERIMENTAL SAVE TO FIREBASE

}
//FIN DOWNLOAD CANVAS








// BUTTON COLORES EVENT HANDLERS
document.getElementById("btncolor-blanco").addEventListener('click', () => {
  currentColor = "#FFFFFF";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});
document.getElementById("btncolor-negro").addEventListener('click', () => {
  currentColor = "rgba(0, 0, 0, 0.5)";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});
document.getElementById("btncolor-azul").addEventListener('click', () => {
  currentColor = "rgba(0, 0, 255, 0.7)";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});
document.getElementById("btncolor-naranja").addEventListener('click', () => {
  currentColor = "#e68106";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});
document.getElementById("btncolor-rojo").addEventListener('click', () => {
  currentColor = "#FF0000";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});
document.getElementById("btncolor-verde").addEventListener('click', () => {
  currentColor = "#008800";
  document.getElementById("color-actual").style.backgroundColor = currentColor;
});




//ACCIONES DE LA SIDE-BAR
document.getElementById("extraccion").addEventListener("click", () => {
  currentAction = MARCAR_EXTRACCION;
  btnOff();
  document.getElementById("extraccion").classList.toggle("activo");

});
document.getElementById("caries").addEventListener("click", () => {
  currentAction = MARCAR_CARIES;
  btnOff();
  document.getElementById("caries").classList.toggle("activo");

});
document.getElementById("marcador").addEventListener("click", () => {
  currentAction = MARCAR_AREA;
  btnOff();
  document.getElementById("marcador").classList.toggle("activo");
});

document.getElementById("ausente").addEventListener("click", () => {
  currentAction = DIENTE_AUSENTE;
  btnOff();
  document.getElementById("ausente").classList.toggle("activo");
});

document.getElementById("lineaH").addEventListener("click", () => {
  currentAction = LINEA_HORIZONTAL;
  btnOff();
  document.getElementById("lineaH").classList.toggle("activo");
});

document.getElementById("lineaV").addEventListener("click", () => {
  currentAction = LINEA_VERTICAL;
  btnOff();
  document.getElementById("lineaV").classList.toggle("activo");
});





document.getElementById("implante").addEventListener("click", () => {
  currentAction = MARCAR_IMPLANTE;
  btnOff();
  document.getElementById("implante").classList.toggle("activo");
});

document.getElementById("eraser").addEventListener("click", () => {
  currentAction = MARCAR_BORRAR;
  btnOff();
  document.getElementById("eraser").classList.toggle("activo");
});

document.getElementById("clear").addEventListener("click", () => {
  currentAction = MARCAR_LIMPIAR;
  btnOff();
  document.getElementById("clear").classList.toggle("activo");
  createCanvas();
});

document.getElementById("puenteFijo").addEventListener("click", () => {
  currentAction = MARCAR_PUENTE_FIJO;
  btnOff();
  document.getElementById("puenteFijo").classList.toggle("activo");
});

document.getElementById("removible").addEventListener("click", () => {
  currentAction = MARCAR_REMOVIBLE;
  btnOff();
  document.getElementById("removible").classList.toggle("activo");
});

document.getElementById("hipersense").addEventListener("click", () => {
  currentAction = MARCAR_HIPERSENSE;
  btnOff();
  document.getElementById("hipersense").classList.toggle("activo");
});

document.getElementById("apical").addEventListener("click", () => {
  currentAction = MARCAR_APICAL;
  btnOff();
  document.getElementById("apical").classList.toggle("activo");
});

document.getElementById("fistula").addEventListener("click", () => {
  currentAction = MARCAR_FISTULA;
  btnOff();
  document.getElementById("fistula").classList.toggle("activo");
});

document.getElementById("empaq-alimento").addEventListener("click", () => {
  currentAction = MARCAR_EMPAQ_ALIMENTO;
  btnOff();
  document.getElementById("empaq-alimento").classList.toggle("activo");
});

document.getElementById("infraoclusion").addEventListener("click", () => {
  currentAction = MARCAR_INFRAOCLUSION;
  btnOff();
  document.getElementById("infraoclusion").classList.toggle("activo");
});

//*********************************************************************************************** */

document.getElementById("profundidad-sondaje").addEventListener("click", () => {
  currentAction = MARCAR_PROFUNDIDAD_SONDAJE;
  btnOff();
  document.getElementById("profundidad-sondaje").classList.toggle("activo");
});

document.getElementById("nivel-insersion").addEventListener("click", () => {
  currentAction = MARCAR_INSERSION_CLINICA;
  btnOff();
  document.getElementById("nivel-insersion").classList.toggle("activo");
});


document.getElementById("sangramiento-sondaje").addEventListener("click", () => {
  currentAction = MARCAR_SANGRAMIENTO_SONDAJE;
  btnOff();
  document.getElementById("sangramiento-sondaje").classList.toggle("activo");
});

document.getElementById("mucosa-masticadora").addEventListener("click", () => {
  currentAction = MARCAR_MUCOSA_MASTICADORA;
  btnOff();
  document.getElementById("mucosa-masticadora").classList.toggle("activo");
});

document.getElementById("defecto-mucogingival").addEventListener("click", () => {
  currentAction = MARCAR_DEFECTO_MUCOGINGIVAL;
  btnOff();
  document.getElementById("defecto-mucogingival").classList.toggle("activo");
});

document.getElementById("movilidad-dentaria").addEventListener("click", () => {
  currentAction = MARCAR_MOVILIDAD_DENTARIA;
  btnOff();
  document.getElementById("movilidad-dentaria").classList.toggle("activo");
});

document.getElementById("compromiso-furcacion").addEventListener("click", () => {
  currentAction = MARCAR_COMPROMISO_FURCACION;
  btnOff();
  document.getElementById("compromiso-furcacion").classList.toggle("activo");
});


document.getElementById("protesis-defectuosa").addEventListener("click", () => {
  currentAction = MARCAR_PROTESIS_DEFECTUOSA;
  btnOff();
  document.getElementById("protesis-defectuosa").classList.toggle("activo");
});

document.getElementById("frenillo").addEventListener("click", () => {
  currentAction = MARCAR_FRENILLO;
  btnOff();
  document.getElementById("frenillo").classList.toggle("activo");
});

document.getElementById("extrusion").addEventListener("click", () => {
  currentAction = MARCAR_EXTRUSION;
  btnOff();
  document.getElementById("extrusion").classList.toggle("activo");
});

document.getElementById("inclinacion").addEventListener("click", () => {
  currentAction = MARCAR_INCLINACION;
  btnOff();
  document.getElementById("inclinacion").classList.toggle("activo");
});

document.getElementById("rotacion").addEventListener("click", () => {
  currentAction = MARCAR_ROTACION;
  btnOff();
  document.getElementById("rotacion").classList.toggle("activo");
});












//*********************************************************************************************** */









// DRAWING EVENT HANDLERS

//AQUI ESTA LA ACCION PRINCIPAL DE DIBUJAR AL LEVANTER EL MOUSE 
canvas.addEventListener('mousedown', function () { mousedown(canvas, event); });

canvas.addEventListener('mousemove', function (e) {
  var p = getMousePos(canvas, e);
  h3.innerHTML = "X: " + p.x + " Y: " + p.y;
  mousemove(canvas, event);
});

canvas.addEventListener('mouseup', mouseup);




// ERASER HANDLING
function eraser() {
  currentSize = 10;
  currentColor = "#FFFFFF";
  currentAction = SIN_SELECCION;
}

// GET MOUSE POSITION
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


//boundaries check
function esAplicable(pos) {
  //el click  esta dentro de la zona dibujable
  if (!((pos.x > 20) && (pos.y > 225 && pos.y < 250))) {
    return true
  } else {
    return false
  }
}

function esOutside(posx, posy) {

  if ((posx >= 0 && posx <= 20)) {
    return true;
  }
  if ((posx >= 585 && posx <= 600)) {
    return true;
  }

  if ((posy >= 0 && posy <= 20)) {
    return true;
  }
  if ((posy >= 435 && posy <= 500)) {
    return true;
  }

  if ((posx > 20) && (posy > 245 && posy < 270)) {
    return true;
  }
  return false
}

// ON MOUSE DOWN DIBUJA UNA LINEA POLIGONAL MIENTRAS SE TENGA EL MOUSE PRESIONADO

function mousedown(canvas, evt) {
  if (currentAction === SIN_SELECCION) {
    //alert("No has seleccionado ningun comando")
    return
  }
  (console.log("mousedown CurrenAction: ", currentAction));
  var mousePos = getMousePos(canvas, evt);
  isMouseDown = true
  var currentPosition = getMousePos(canvas, evt);
  ctx.moveTo(currentPosition.x, currentPosition.y)
  ctx.beginPath();
  ctx.lineWidth = currentSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

  if (currentAction === MARCAR_EXTRACCION) {
    extraccion(currentPosition.x, currentPosition.y)
  }
  if (currentAction === DIENTE_AUSENTE) {
    ausente(currentPosition.x, currentPosition.y)
  }




}

// ON MOUSE MOVE

function mousemove(canvas, evt) {
  if (currentAction === MARCAR_AREA) {
    if (isMouseDown) {
      console.log("el mouse esta down");
      var currentPosition = getMousePos(canvas, evt);
      if (esAplicable(currentPosition)) {
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke();
        store(currentPosition.x, currentPosition.y, currentSize, currentColor);
      }
    }
  }
}

// STORE DATA

function store(x, y, s, c) {
  var line = {
    "x": x,
    "y": y,
    "size": s,
    "color": c
  }
  linesArray.push(line);
}

// ON MOUSE UP

function mouseup(evt) {
  var position = getMousePos(canvas, evt);
  var contorno = canvas.getBoundingClientRect();

  if (currentAction === MARCAR_CARIES) {

    if (esAplicable(position)) {

      //ctx.globalCompositeOperation = 'source-atop';
      ctx.beginPath();
      ctx.arc(evt.clientX - contorno.left, evt.clientY - contorno.top, 5, 0, 2 * Math.PI);
      ctx.fillStyle = currentColor;
      ctx.fill();
      ctx.stroke();
    }
  }

  if (currentAction === MARCAR_FRACTURA) {
    fractura(position.x, position.y);
  }

  if (currentAction === LINEA_HORIZONTAL) {
    paralelasH(position.x, position.y);
  }

  if (currentAction === LINEA_VERTICAL) {
    paralelasV(position.x, position.y);
  }

  if (currentAction === MARCAR_BOX_UP) {
    boxUp(position.x, position.y);
  }

  if (currentAction === MARCAR_BOX_DOWN) {
    boxDown(position.x, position.y);
  }

  if (currentAction === MARCAR_IMPLANTE) {
    implante(position.x, position.y)
  }

  if (currentAction === MARCAR_PUENTE_FIJO) {
    puenteFijo(position.x, position.y)
  }

  if (currentAction === MARCAR_REMOVIBLE) {
    removible(position.x, position.y)
  }

  if (currentAction === MARCAR_HIPERSENSE) {
    hipersense(position.x, position.y)
  }

  if (currentAction === MARCAR_APICAL) {
    apical(position.x, position.y)
  }

  if (currentAction === MARCAR_FISTULA) {
    fistula(position.x, position.y)
  }

  if (currentAction === MARCAR_EMPAQ_ALIMENTO) {
    empaqAlim(position.x, position.y)
  }

  if (currentAction === MARCAR_INFRAOCLUSION) {
    infraoclusion(position.x, position.y)
  }

  if (currentAction === MARCAR_PROFUNDIDAD_SONDAJE) {
    profundidadSondaje(position.x, position.y)
  }

  if (currentAction === MARCAR_INSERSION_CLINICA) {
    nivelInsersionClinica(position.x, position.y)
  }

  if (currentAction === MARCAR_SANGRAMIENTO_SONDAJE) {
    sangramientoSondaje(position.x, position.y)
  }

  if (currentAction === MARCAR_MUCOSA_MASTICADORA) {
    mucosaMasticadora(position.x, position.y)
  }

  if (currentAction === MARCAR_DEFECTO_MUCOGINGIVAL) {
    defectoMucogingival(position.x, position.y)
  }

  if (currentAction === MARCAR_MOVILIDAD_DENTARIA) {
    movilidadDentariaI(position.x, position.y)
  }

  if (currentAction === MARCAR_COMPROMISO_FURCACION) {
    compromisoFurcacion(position.x, position.y)
  }

  if (currentAction === MARCAR_PROTESIS_DEFECTUOSA) {
    protesisDefectuosa(position.x, position.y)
  }

  if (currentAction === MARCAR_FRENILLO) {
    frenillo(position.x, position.y)
  }

  if (currentAction === MARCAR_EXTRUSION) {
    extrusion(position.x, position.y)
  }

  if (currentAction === MARCAR_INCLINACION) {
    inclinacion(position.x, position.y)
  }

  if (currentAction === MARCAR_ROTACION) {
    rotacion(position.x, position.y)
  }

  isMouseDown = false
  store()
}






//SIMBOLOGIA DEL ODONTOGRAMA 

function extraccion(posx, posy) {

  //verificar que no se hizo click en areas no dibujable (fuera del cuadro de odontograma)
  if (esOutside(posx, posy)) {
    return false;
  }
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(posx - 15, calibrarY(posy) - 80);
  ctx.lineTo(posx + 15, calibrarY(posy) + 80); // Red line
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(posx + 15, calibrarY(posy) - 80);
  ctx.lineTo(posx - 15, calibrarY(posy) + 80); // Red line
  ctx.closePath();
  ctx.stroke();
}

function ausente(posx, posy) {
  //verificar que no se hizo click en areas no dibujable (fuera del cuadro de odontograma)
  if (esOutside(posx, posy)) {
    return false;
  }
  ctx.beginPath();
  ctx.moveTo(posx, calibrarY(posy) - 95);
  ctx.lineTo(posx, calibrarY(posy) + 90); // Red line
  ctx.closePath();
  ctx.stroke();
}

function paralelasV(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x - 3, y - 10);
  ctx.moveTo(x + 2, y);
  ctx.lineTo(x + 2, y - 10);
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x - 3, y + 10);
  ctx.moveTo(x + 2, y);
  ctx.lineTo(x + 2, y + 10);
  ctx.stroke();
}

function puenteFijo(x, y) {
  console.log("puenteFijo");
  if (esOutside(x, y)) {
    return false;
  }

  let xoffset = 12
  x = x - xoffset;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = currentColor;
  ctx.fill();

  ctx.lineTo(x + 20, y); // Red line

  ctx.arc(x + 25, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = currentColor;
  ctx.fill();

  ctx.closePath();
  ctx.stroke();
}

function implante(x, y) {

  y = y - 5

  ctx.lineWidth = 3;
  ctx.moveTo(x, y); //295,250  
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y);
  ctx.lineTo(x - 10, y);

  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 7);

  ctx.moveTo(x, y + 8);
  ctx.lineTo(x + 10, y + 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x - 10, y + 8);

  ctx.stroke();
}

function removible(x, y) {

  if (esOutside(x, y)) {
    return false;
  }

  x = x - 15;
  ctx.lineWidth = 2;

  ctx.beginPath();
  moveTo(x, y)
  ctx.arc(x, y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = currentColor;
  ctx.fill();
  ctx.closePath();

  ctx.lineTo(x + 10, y - 6);
  ctx.lineTo(x + 17, y);
  ctx.lineTo(x + 25, y - 6);
  ctx.lineTo(x + 32, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 35, y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = currentColor;
  ctx.fill();
  ctx.closePath();

  ctx.stroke();
}


function hipersense(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  y = y - 15;
  x = x - 5
  ctx.lineWidth = 2;
  console.log(x, y)
  ctx.beginPath();
  moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x + 8, y + 4);
  ctx.lineTo(x, y + 8);
  ctx.lineTo(x + 8, y + 12);
  ctx.lineTo(x, y + 16);
  ctx.lineTo(x + 8, y + 20);
  ctx.lineTo(x, y + 24);

  ctx.fillStyle = currentColor;
  ctx.stroke();
}

function apical(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.strokeStyle = currentColor;
  ctx.closePath();
  ctx.stroke();
}

function fistula(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, 2 * Math.PI);
  ctx.fillStyle = currentColor;
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}


function empaqAlim(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  ctx.font = "bold 20px serif"

  ctx.fillStyle = currentColor;
  ctx.fillText("E", x - 7, y + 5);


}

function infraoclusion(x, y) {



  x = x - 5;
  y = y - 5

  ctx.lineWidth = 2;
  ctx.fillStyle = currentColor;
  ctx.moveTo(x + 5, y - 10);
  ctx.lineTo(x + 5, y)
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y)
  ctx.lineTo(x + 5, y + 15);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



function extrusion(x, y) {

  ctx.lineWidth = 2;
  ctx.fillStyle = currentColor;
  x = x - 5;
  // ctx.moveTo(x + 5, y - 10);

  //ctx.lineTo(x + 5, y)
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y - 15)
  ctx.lineTo(x + 10, y);


  ctx.moveTo(x + 5, y);
  ctx.lineTo(x + 5, y + 10)

  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

function inclinacion(x, y) {

  ctx.lineWidth = 2;
  ctx.fillStyle = currentColor;
  y = y - 5;
  //triangulo
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y + 5)
  ctx.lineTo(x, y + 10);


  ctx.moveTo(x + 5, y + 5);
  ctx.lineTo(x - 10, y + 5)

  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}


function rotacion(x, y) {

  ctx.lineWidth = 2;
  ctx.fillStyle = currentColor;

  // ctx.moveTo(x + 5, y - 10);

  //ctx.lineTo(x + 5, y)
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y - 15)
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y);
  ctx.fill();

  //ctx.moveTo(x-10, y);
  ctx.arc(x - 5, y, 10, 0, Math.PI, false);


  //ctx.moveTo(x + 5, y);
  //ctx.lineTo(x + 5, y + 10)



  ctx.stroke();
}





function profundidadSondaje(x, y) {
  if (esOutside(x, y)) {
    return false;
  }

  x = x - 5;

  ctx.font = "bold 20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("PS", x - 7, y + 5);
}

function nivelInsersionClinica(x, y) {
  if (esOutside(x, y)) {
    return false;
  }

  x = x - 8;
  ctx.font = "bold 20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("NIC", x - 7, y + 5);
}

function sangramientoSondaje(x, y) {
  if (esOutside(x, y)) {
    return false;
  }

  x = x - 5;
  ctx.font = "bold 20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("S.S", x - 7, y + 5);
}

function mucosaMasticadora(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  x = x - 5;
  ctx.font = "bold 20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("M.M", x - 7, y + 5);
}

function defectoMucogingival(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  x = x - 8;
  ctx.font = "bold 20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("D.M.G", x - 7, y + 5);
}


function movilidadDentariaI(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  x = x - 10;
  ctx.font = "bold 15px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("M.O.V.", x - 7, y + 5);
}

function compromisoFurcacion(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  x = x - 5
  ctx.font = "bold 15px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("C.F.", x - 7, y + 5);
}

function protesisDefectuosa(x, y) {
  if (esOutside(x, y)) {
    return false;
  }
  x = x - 5;
  ctx.font = "bold 15px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("P.D.", x - 7, y + 5);
}

function frenillo(x, y) {
  if (esOutside(x, y)) {
    return false;
  }

  ctx.font = "20px serif"
  ctx.fillStyle = currentColor;
  ctx.fillText("Y", x - 7, y + 5);
}



function boxUp(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  ctx.moveTo(x, y); //300,250
  ctx.lineTo(x, y + 15);
  ctx.lineTo(x + 15, y + 15)
  ctx.lineTo(x + 15, y)
  ctx.stroke();
}

function boxDown(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  ctx.moveTo(x, y);//300,245
  ctx.lineTo(x, y - 15);
  ctx.lineTo(x + 15, y - 15)
  ctx.lineTo(x + 15, y)
  ctx.stroke();
}

function paralelasH(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  console.log("cordenadas recibidas: ", x, y);
  x = x - 10;
  y = y - 3;
  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + 20, y + 5);
  ctx.stroke();
}



function fractura(x, y) {
  ctx.strokeStyle = currentColor;
  ctx.moveTo(x, y);
  ctx.lineTo(x - 5, y);
  ctx.lineTo(x - 5, y + 5);
  ctx.lineTo(x - 10, y + 5);
  ctx.lineTo(x - 10, y + 10);
  ctx.lineTo(x - 15, y + 10);
  ctx.stroke();
}


function lineaPerpendicular() {
  ctx.lineWidth = 3;
  ctx.moveTo(300, 250);
  ctx.lineTo(290, 270)

  ctx.stroke();
}

function extractIcon() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgb(0, 0,255)";

  ctx.moveTo(290, 250);
  ctx.lineTo(300, 270)

  ctx.moveTo(300, 250);
  ctx.lineTo(290, 270)

  ctx.stroke();
}





//CALIBRAR POSICION AL MEDIO DEL CUADRANTE (HORIZONTALMENTE)

function calibrarY(y) {
  if (y >= 237 && y <= 460) {
    let newy = 340;
    return newy
  }
  if (y >= 0 && y <= 236) {
    let newy = 130;
    return newy
  }
  return y;
};



function btnOff() {
  let comandos = document.getElementsByClassName("td-btn");
  Array.from(comandos).forEach((el) => {
    if (el.classList.contains("activo")) {
      el.classList.toggle("activo");
    }
  })
}