const historia = document.getElementById("historia-form");
const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
console.log("este es el paciente seleccionado de la tabla mosca", idPacienteLocal);
const controlContainer = document.getElementById("control-container");


window.addEventListener('DOMContentLoaded', async () => {
  console.log("idPacienteLocal: ", idPacienteLocal)
  const snopshot = await db.collection('pacientes').doc(idPacienteLocal).get();
  const data = snopshot.data();



  //here we go

  document.getElementById('nombre').value = data.nombre;
  document.getElementById('apellido').value = data.apellido;
  document.getElementById('cedula').value = data.cedula;
  document.getElementById('fnacimiento').value = data.fnacimiento;
  document.getElementById('celular').value = data.celular;
  document.getElementById('tlflocal').value = data.tlflocal;
  document.getElementById('email').value = data.email;
  document.getElementById('edad').value = data.edad;

  data.genero == 'hombre' ? document.getElementById('checkgenero1').setAttribute('checked', 'true') : "";
  data.genero == 'mujer' ? document.getElementById('checkgenero2').setAttribute('checked', 'true') : "";
  data.genero == 'diverso' ? document.getElementById('checkgenero3').setAttribute('checked', 'true') : "";

  data.edocivil == 'soltero' ? document.getElementById('checkedocivil1').setAttribute('checked', 'true') : "";
  data.edocivil == 'casado' ? document.getElementById('checkedocivil2').setAttribute('checked', 'true') : "";
  data.edocivil == 'divorciado' ? document.getElementById('checkedocivil3').setAttribute('checked', 'true') : "";
  data.edocivil == 'otro' ? document.getElementById('checkedocivil4').setAttribute('checked', 'true') : "";

  document.getElementById('direccion1').value = data.direccion1;
  document.getElementById('contacto').value = data.contacto;

  document.getElementById('estatura').value = data.estatura;
  document.getElementById('peso').value = data.peso;

  //para 2 radio buttons de si no
  data.tratadopormedico == 'true' ? document.getElementById('checktratadopormedico1').setAttribute('checked', 'true') : "";
  data.tratadopormedico == 'false' ? document.getElementById('checktratadopormedico2').setAttribute('checked', 'true') : "";

  document.getElementById('tratadoporenfermedad').value = data.tratadoporenfermedad;

  data.checktomamedicamento == 'true' ? document.getElementById('checktomamedicamento1').setAttribute('checked', 'true') : "";
  data.checktomamedicamento == 'false' ? document.getElementById('checktomamedicamento2').setAttribute('checked', 'true') : "";

  document.getElementById('cualesmedicamentos').value = data.cualesmedicamentos;
  document.getElementById('dosismeds').value = data.dosismeds;



  data.alergias.forEach((alergia) => {
    console.log("ForEach Alergias: ", alergia);
    alergia == 'aspirina' ? document.getElementById('checkaspirina').setAttribute('checked', 'true') : "";
    alergia == 'penicilina' ? document.getElementById('checkpenicilina').setAttribute('checked', 'true') : "";
    alergia == 'Anestecia-Local' ? document.getElementById('checkanestecialocal').setAttribute('checked', 'true') : "";
    alergia == 'codeina' ? document.getElementById('checkcodeina').setAttribute('checked', 'true') : "";
    alergia == 'Latex' ? document.getElementById('checklatex').setAttribute('checked', 'true') : "";
    alergia == 'Acrilico' ? document.getElementById('checkacrilico').setAttribute('checked', 'true') : "";
  });

  data.checkalergicootros == "true" ? document.getElementById('checkalergicootros').setAttribute('checked', 'true') : "";
  document.getElementById('textalergicootros').value = data.textalergicootros;

  data.checkcirugias == 'true' ? document.getElementById('checkalergicootros').setAttribute('checked', 'true') : "";


  data.antecedentesPersonales.forEach((antecedente) => {

    antecedente == 'Tuvo-Cirugias' ? document.getElementById('checkcirugias').setAttribute('checked', 'true') : "";
    antecedente == 'Tuvo-Lesiones-Cabeza' ? document.getElementById('checklesiones').setAttribute('checked', 'true') : "";
    antecedente == 'Tiene-Dieta' ? document.getElementById('checkdieta').setAttribute('checked', 'true') : "";
    antecedente == 'Es Fumador' ? document.getElementById('checkfumador').setAttribute('checked', 'true') : "";
    antecedente == 'Usa-Sustancias-Controladas' ? document.getElementById('checkcontroladas').setAttribute('checked', 'true') : "";
    antecedente == 'Esta-Embarazada' ? document.getElementById('checkembarazada').setAttribute('checked', 'true') : "";
    antecedente == 'Usa-Anticonceptivos' ? document.getElementById('checkanticonceptivos').setAttribute('checked', 'true') : "";
    antecedente == 'Esta-Amamantando' ? document.getElementById('checkamamantando').setAttribute('checked', 'true') : "";
  });

  document.getElementById('texthabitos').value = data.texthabitos;

  data.antecedentesFamiliares.forEach((antecedenteFam) => {

    antecedenteFam == 'Familiar-Cancer' ? document.getElementById('checkcancer').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-Tuberculosis' ? document.getElementById('checktuberculosis').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-HIV' ? document.getElementById('checkhiv').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-Diabetes' ? document.getElementById('checkdiabetes').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-Cardiovasculares' ? document.getElementById('checkcardiovasculares').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-Hemorragicas' ? document.getElementById('checkhemorragicas').setAttribute('checked', 'true') : "";
    antecedenteFam == 'Familiar-Venereas' ? document.getElementById('checkvenereas').setAttribute('checked', 'true') : "";

  });

  document.getElementById('otraenfermedad').value = data.otraenfermedad;

  document.getElementById('motivoprincipalconsulta').value = data.motivoprincipalconsulta;

  document.getElementById('fechaultimaconsulta').value = data.fechaultimaconsulta;

  document.getElementById('motivoultimaconsulta').value = data.motivoultimaconsulta;

  //para 2 radio buttons de si no
  data.checkcomplicaciones == 'true' ? document.getElementById('checkcomplicaciones1').setAttribute('checked', 'true') : "";
  data.checkcomplicaciones == 'false' ? document.getElementById('checkcomplicaciones2').setAttribute('checked', 'false') : "";
  document.getElementById('cualescomplicaciones').value = data.cualescomplicaciones;

  document.getElementById('texttratamiento').value = data.texttratamiento;
});



historia.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = historia['nombre'].value;
  const apellido = historia['apellido'].value;
  const cedula = historia['cedula'].value;
  const fnacimiento = historia['fnacimiento'].value;
  const celular = historia['celular'].value;
  const tlflocal = historia['tlflocal'].value;
  const email = historia['email'].value;
  const contacto = historia['contacto'].value;
  const genero = document.querySelector('input[name="checkgenero"]:checked')?.value ?
    document.querySelector('input[name="checkgenero"]:checked').value : "";

  const edocivil = document.querySelector('input[name="checkedocivil"]:checked')?.value ?
    document.querySelector('input[name="checkedocivil"]:checked').value : "";
  const direccion1 = historia['direccion1'].value;
  const estatura = historia['estatura'].value;
  const peso = historia['peso'].value;
  const edad = historia['edad'].value;
  const tratadopormedico = document.querySelector('input[name="checktratadopormedico"]:checked')?.value ?
    document.querySelector('input[name="checktratadopormedico"]:checked').value : "";


  const tratadoporenfermedad = historia['tratadoporenfermedad'].value;

  const checktomamedicamento = document.querySelector('input[name="checktomamedicamento"]:checked')?.value ?
    document.querySelector('input[name="checktomamedicamento"]:checked').value : "";


  const checkcomplicaciones = document.querySelector('input[name="checkcomplicaciones"]:checked')?.value ?
    document.querySelector('input[name="checkcomplicaciones"]:checked').value : "";


  const cualesmedicamentos = historia['cualesmedicamentos'].value;
  const dosismeds = historia['dosismeds'].value;
  const checkaspirina = historia['checkaspirina'].checked ? true : false;
  const checkpenicilina = historia['checkpenicilina'].checked ? "penicilina" : "";
  const checkanestecialocal = historia['checkanestecialocal'].checked ? "Anestecia-Local" : "";
  const checkcodeina = historia['checkcodeina'].checked ? "codeina" : "";
  const checklatex = historia['checklatex'].checked ? "Latex" : "";
  const checkacrilico = historia['checkacrilico'].checked ? "Acrilico" : "";
  const checkalergicootros = historia['checkalergicootros'].checked ? true : false;
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

  const cualescomplicaciones = historia['cualescomplicaciones'].value;
  const texttratamiento = historia['texttratamiento'].value;
  //Crear Objeto para enviar a firebase con todos los campos 
  const paciente = {
    nombre,
    apellido,
    cedula,
    fnacimiento,
    celular,
    tlflocal,
    email,
    contacto,
    genero,
    edocivil,
    direccion1,
    estatura,
    peso,
    edad,
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

  await db.collection('pacientes').doc(idPacienteLocal).update(paciente)
    .then(result => alert("La informacion del Paciente ha sido actualizada con exito!"))
    .catch(error => alert(error));

  window.location.reload();
});

