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


const SIN_SELECCION = 0;

// SETTING ALL VARIABLES
var isMouseDown = false;
var canvas = document.createElement('canvas');
var body = document.getElementsByTagName("body")[0];
var ctx = canvas.getContext('2d');
var linesArray = [];
currentSize = 3;
var currentColor = "rgb(200,20,100)";
var currentAction = SIN_SELECCION;
var currentBg = "white";
var odogramaOriginal = document.getElementById("img-hidden");
var cargarImagen = document.getElementById("cargarImg");
var recortarImagen = document.getElementById("recortarImg");
var h3 = document.getElementById("myH3");
var odograma = new Image();
//asignar ubicacion donde esta la imagen del odograma
odograma.src = "images/odograma1.jpg"

odograma.addEventListener('load', () => {
  createCanvas();
});
// INITIAL LAUNCH


// CREATE CANVAS

function createCanvas() {
  canvas.id = "canvas";
  canvas.width = 700;
  canvas.height = 500;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid rgb(121, 113, 113)";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  ctx.drawImage(odograma, 20, 20, 600, 461);
}



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
document.getElementById('eraser').addEventListener('click', eraser);

document.getElementById('clear').addEventListener('click', createCanvas);

//descargar archivo (guardar)
document.getElementById('saveToImage').addEventListener('click', function () {
  downloadCanvas(this, 'canvas', 'imagenes/odograma.jpg');
}, false);

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
document.getElementById("fractura").addEventListener("click", () => {
  currentAction = MARCAR_FRACTURA;
  btnOff();
  document.getElementById("fractura").classList.toggle("activo");
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

document.getElementById("boxup").addEventListener("click", () => {
  currentAction = MARCAR_BOX_UP;
  btnOff();
  document.getElementById("boxup").classList.toggle("activo");
});

document.getElementById("boxdown").addEventListener("click", () => {
  currentAction = MARCAR_BOX_DOWN;
  btnOff();
  document.getElementById("boxdown").classList.toggle("activo");
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
});













// DRAWING EVENT HANDLERS

//AQUI ESTA LA ACCION PRINCIPAL DE DIBUJAR AL LEVANTER EL MOUSE 
canvas.addEventListener('mousedown', function () { mousedown(canvas, event); });

canvas.addEventListener('mousemove', function (e) {
  var p = getMousePos(canvas, e);
  h3.innerHTML = "X: " + p.x + " Y: " + p.y;
  mousemove(canvas, event);
});

canvas.addEventListener('mouseup', mouseup);


// DOWNLOAD CANVAS

function downloadCanvas(link, canvas, filename) {
  link.href = document.getElementById(canvas).toDataURL();
  link.download = filename;
}

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

// ON MOUSE DOWN DIBUJA UNA LINEA POLIGONAL MIENTRAS SE TENGA EL MOUSE PRESIONADO

function mousedown(canvas, evt) {
  if (currentAction === SIN_SELECCION) {
    alert("No has seleccionado ningun comando")
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
  console.log("mouse move CurrentAction: ", currentAction);

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

  if(currentAction===MARCAR_IMPLANTE){
    implante(position.x, position.y)
  }






  isMouseDown = false
  store()
}


function esAplicable(pos) {

  //el click  esta dentro de la zona dibujable
  if (!((pos.x > 20) && (pos.y > 245 && pos.y < 270))) {
    return true
  } else {
    return false
  }
}

function extraccion(posx, posy) {

  if (((posx - 20) < 15) || ((posx - 20) > 585)) {
    console.log("fuera de boundaries");
    return
  }


  let posx2 = calibrarX(posx);
  let posy2 = calibrarY(posy);
  //console.log("calibrar X: ", posx, "calibrar y: ", posy);


  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgb(0, 0, 255)";
  ctx.beginPath();
  ctx.moveTo(posx2 - 15, posy2 - 70);
  ctx.lineTo(posx2 + 15, posy2 + 70); // Red line
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgb(0, 0, 255)";
  ctx.beginPath();
  ctx.moveTo(posx2 + 15, posy2 - 70);
  ctx.lineTo(posx2 - 15, posy2 + 70); // Red line
  ctx.closePath();
  ctx.stroke();

  /* ctx.strokeStyle = "rgb(255, 0, 0)";
  ctx.strokeRect(25, 45, 40, 200); // Red square */



  /*  ctx.strokeRect(180, 40, 100, 100); // Red square
   ctx.strokeStyle = "rgb(0, 0, 0)";
   ctx.strokeRect(320, 40, 100, 100); // Black square */
}

function ausente(posx, posy) {

  if (((posx - 20) < 15) || ((posx - 20) > 585)) {
    console.log("fuera de boundaries");
    return
  }


  let posx2 = calibrarX(posx);
  let posy2 = calibrarY(posy);
  //console.log("calibrar X: ", posx, "calibrar y: ", posy);


  /* ctx.lineWidth = 3;
  ctx.strokeStyle = "rgb(0, 0, 255)";
  ctx.beginPath();
  ctx.moveTo(posx2 - 15, posy2 - 70);
  ctx.lineTo(posx2 + 15, posy2 + 70); // Red line
  ctx.closePath();
  ctx.stroke();
 */
  ctx.strokeStyle = "rgb(0, 0, 255)";
  ctx.beginPath();
  ctx.moveTo(posx2 + 15, posy2 - 70);
  ctx.lineTo(posx2 - 15, posy2 + 70); // Red line
  ctx.closePath();
  ctx.stroke();

  /* ctx.strokeStyle = "rgb(255, 0, 0)";
  ctx.strokeRect(25, 45, 40, 200); // Red square */



  /*  ctx.strokeRect(180, 40, 100, 100); // Red square
   ctx.strokeStyle = "rgb(0, 0, 0)";
   ctx.strokeRect(320, 40, 100, 100); // Black square */
}























function crearLegos() {
  ctx.strokeStyle = "rgb(0, 0,255)";
  //ctx.strokeRect(25, 45, 40, 200); // Red square */
  //ctx.strokeRect(180, 40, 100, 100); // Red square
  //ctx.strokeStyle = "rgb(0, 0, 0)";
  //ctx.strokeRect(320, 40, 100, 100); // Black square




  ctx.moveTo(300, 250);
  ctx.lineTo(300, 270);
  ctx.lineTo(320, 270)
  ctx.lineTo(320, 250)
  ctx.stroke();
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
  ctx.moveTo(x, y);
  ctx.lineTo(x + 25, y);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + 25, y + 5);
  ctx.stroke();
}

function paralelasV(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 20);
  ctx.moveTo(x + 5, y);
  ctx.lineTo(x + 5, y - 20);
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

function implante(x, y) {
  ctx.strokeStyle = "rgb(0, 0,255)";
  ctx.lineWidth=2;
  ctx.moveTo(x,y); //295,250
  ctx.lineTo(x+15, y);
  ctx.moveTo(x, y+5);
  ctx.lineTo(x+15, y+5);
  ctx.moveTo(x, y+10);
  ctx.lineTo(x+15, y+10)

  y=y+20
  

  ctx.moveTo(x,y);//300,270
  ctx.lineTo(x+5, y);
  ctx.moveTo(x+5, y);
  ctx.lineTo(x+5, y-20);
  ctx.moveTo(x+10, y);
  ctx.lineTo(x+10, y-20);
  ctx.stroke();
}

function lineaPerpendicular() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgb(0, 0,255)";

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





//CALIBRAR POSICION DEL MARCADOR EXTRACCION
function calibrarX(x) {
  if (x >= 290 && x <= 315) {
    let newx = 302;
    return newx
  }
  return x;
};

function calibrarY(y) {
  if (y >= 257 && y <= 500) {
    let newy = 359;
    return newy
  }
  if (y >= 0 && y <= 256) {
    let newy = 150;
    return newy
  }
  return y;
};



function btnOff() {
  let comandos = document.getElementsByClassName("btn comando");
  Array.from(comandos).forEach((el) => {
    if (el.classList.contains("activo")) {
      el.classList.toggle("activo");
    }
  })


}