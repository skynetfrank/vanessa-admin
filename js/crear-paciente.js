const historia = document.getElementById("historia-form");
const dataShower = document.getElementById("dataShow");
localStorage.clear();

historia.addEventListener('submit', async (e) => {
  e.preventDefault();


  const nombre = historia['nombre'].value;
  const apellido = historia['apellido'].value;
  const cedula = historia['cedula'].value;
  const fnacimiento = historia['fnacimiento'].value;
  const celular = historia['celular'].value;
  const tlflocal = historia['tlflocal'].value;
  const email = historia['email'].value;
  const edad = historia['edad'].value;


  const genero = document.querySelector('input[name="checkgenero"]:checked').value;
  const edocivil = document.querySelector('input[name="checkedocivil"]:checked').value;


  const direccion1 = historia['direccion1'].value;
  const contacto = historia['contacto'].value;
  const estatura = historia['estatura'].value;
  const peso = historia['peso'].value;

  const tratadopormedico = document.querySelector('input[name="checktratadopormedico"]:checked').value;

  const tratadoporenfermedad = historia['tratadoporenfermedad'].value;
  const checktomamedicamento = document.querySelector('input[name="checktomamedicamento"]:checked').value;
  const cualesmedicamentos = historia['cualesmedicamentos'].value;
  const dosismeds = historia['dosismeds'].value;
  const checkaspirina = historia['checkaspirina'].checked ? "aspirina" : "";
  const checkpenicilina = historia['checkpenicilina'].checked ? "penicilina" : "";
  const checkanestecialocal = historia['checkanestecialocal'].checked ? "Anestecia-Local" : "";
  const checkcodeina = historia['checkcodeina'].checked ? "codeina" : "";
  const checklatex = historia['checklatex'].checked ? "Latex" : "";
  const checkacrilico = historia['checkacrilico'].checked ? "Acrilico" : "";
  const checkalergicootros = historia['checkalergicootros'].checked ? "true" : "";
  const textalergicootros = historia['textalergicootros'].value;
  const checkcirugias = historia['checkcirugias'].checked ? "Tuvo-Cirugias" : "";
  const checklesiones = historia['checklesiones'].checked ? "Tuvo-Lesiones-Cabeza" : "";
  const checkdieta = historia['checkdieta'].checked ? "Tiene-Dieta" : "";
  const checkfumador = historia['checkfumador'].checked ? "Es Fumador" : "";
  const checkcontroladas = historia['checkcontroladas'].checked ? "Usa-Sustancias-Controladas" : "";
  const checkembarazada = historia['checkembarazada'].checked ? "Esta-Embarazada" : "";
  const checkanticonceptivos = historia['checkanticonceptivos'].checked ? "Usa-Anticonceptivos" : "";
  const checkamamantando = historia['checkamamantando'].checked ? "Esta-Amamantando" : "";
  const checkcancer = historia['checkcancer'].checked ? "Familiar-Cancer" : "";
  const checktuberculosis = historia['checktuberculosis'].checked ? "Familiar-Tuberculosis" : "";
  const checkhiv = historia['checkhiv'].checked ? "Familiar-HIV" : "";
  const checkdiabetes = historia['checkdiabetes'].checked ? "Familiar-Diabetes" : "";
  const checkcardiovasculares = historia['checkcardiovasculares'].checked ? "Familiar-Cardiovasculares" : "";;
  const checkhemorragicas = historia['checkhemorragicas'].checked ? "Familiar-Hemorragicas" : "";
  const checkvenereas = historia['checkvenereas'].checked ? "Familiar-Venereas" : "";
  const otraenfermedad = historia['otraenfermedad'].value;
  const texthabitos = historia['texthabitos'].value;
  const motivoprincipalconsulta = historia['motivoprincipalconsulta'].value;
  const fechaultimaconsulta = historia['fechaultimaconsulta'].value;
  const motivoultimaconsulta = historia['motivoultimaconsulta'].value;
  const checkcomplicaciones = document.querySelector('input[name="checkcomplicaciones"]:checked').value;
  const cualescomplicaciones = historia['cualescomplicaciones'].value;
  const texttratamiento = historia['texttratamiento'].value;
  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const textcontrolasistencia = historia['textcontrolasistencia'].value;
  const formadepago = historia['formadepago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = historia['montopagado'].value;
  //Crear Objeto para enviar a firebase con todos los campos 


  const paciente = {
    nombre,
    apellido,
    cedula,
    fnacimiento,
    celular,
    tlflocal,
    email,
    edad,
    genero,
    edocivil,
    direccion1,
    contacto,
    estatura,
    peso,
    tratadopormedico,
    tratadoporenfermedad,
    checktomamedicamento,
    cualesmedicamentos,
    dosismeds,
    alergias: [checkaspirina,
      checkpenicilina,
      checkanestecialocal,
      checkcodeina,
      checklatex,
      checkacrilico,
    ],
    checkalergicootros,
    textalergicootros,
    antecedentesPersonales:
      [checkcirugias,
        checklesiones,
        checkdieta,
        checkfumador,
        checkcontroladas,
        checkembarazada,
        checkanticonceptivos,
        checkamamantando,],
    antecedentesFamiliares:
      [
        checkcancer,
        checktuberculosis,
        checkhiv,
        checkdiabetes,
        checkcardiovasculares,
        checkhemorragicas,
        checkvenereas,
      ],
    otraenfermedad,
    texthabitos,
    motivoprincipalconsulta,
    fechaultimaconsulta,
    motivoultimaconsulta,
    checkcomplicaciones,
    cualescomplicaciones,
    texttratamiento,
  }

  const { id } = await db.collection('pacientes').add(paciente);
  localStorage.setItem('pacienteActual', JSON.stringify(id));
  //Esta es una Root Coleccion para hacer Join con Pacientes
  const controlAsistencia = {
    idPaciente: id,
    fecha: fechacontrolasistencia,
    tratamientoAplicado: textcontrolasistencia,
    pago: formadepago,
    referencia: referenciapago,
    monto: montopagado,
  };
  await db.collection('controlasistencias').add(controlAsistencia)
    .then(response => alert("Control Asistencias Agregado OK"))
    .catch(error => console.log(error));
  alert
  historia.reset();
});

