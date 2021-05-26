const modal__signup = document.getElementById("modal-signup");
const modal__login = document.getElementById("modal-login");
const modal__msg = document.getElementById("modal-msg");
const modal__crud = document.getElementById("modal-crud");

//configuracion de materializa para usar los modales
document.addEventListener("DOMContentLoaded", () => {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  const items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

//fragmentos de los modales para simplificar el archivo index.html
modal__signup.innerHTML = `<div class="modal-content">
        <h4>Crear Cuenta</h4>
        <br />
        <form id="signup-form">
          <div class="input-field">
            <input type="email" id="signup-email" required />
            <label for="signup-email">Direccion de Correo</label>
          </div>
          <div class="input-field">
            <input type="password" id="signup-password" required />
            <label for="signup-password">Ingrese una clave</label>
          </div>
          <div class="input-field">
            <input type="text" id="signup-bio" required />
            <label for="signup-bio">Biografia</label>
          </div>
         
        </form>
      </div>`

modal__login.innerHTML = `<div class="modal-content">
            <h4>Inicio de Sesion</h4>
              <form id="login-form">
                <div class="input-field">
                    <input type="email" id="login-email" required />
                    <label for="login-email">Ingresa una direccion de correo</label>
                </div>
                <div class="input-field">
                    <input type="password" id="login-password" required />
                    <label for="login-password">ingresa una clave (password)</label> 
                </div>
                <button class="btn inicio lime z-depth-0">enviar</button>                
            </form>
        </div>`

modal__msg.innerHTML = `<div class="modal-content">
      <h4>Administrador</h4>
      <p id="ptag"></p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat lime ">Cerrar</a>
    </div>`

modal__crud.innerHTML = `
<div class="modal-content">
        <h4>Pacientes</h4>
    </div>
    <div class="pacientes-box">
        <button class="btn cyan z-depth-0" id="btn-agregar-paciente">Nuevo</button>
        <button class="btn  cyan z-depth-0" id="btn-agregar-paciente">Editar</button>
        <button class="btn  cyan z-depth-0" id="btn-agregar-paciente">Eliminar</button>
        <button class="btn  cyan z-depth-0" id="btn-agregar-paciente">Consultar</button>
    </div>
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat lime ">Cerrar</a>
    </div>
`



