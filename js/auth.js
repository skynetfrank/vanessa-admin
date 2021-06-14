//codigo para login logout y signup)
const form__login = document.getElementById("login-form");
const form__signup = document.getElementById("signup-form");
const boton__logout = document.getElementById("logout");
const msgInstance = M.Modal.getInstance(modal__msg);
const mensaje = document.getElementById("ptag");


form__login.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form__login["login-email"].value;
    const pw = form__login["login-password"].value;
    boton__logout.style.display = "block";
     console.log("inside login")
    auth.signInWithEmailAndPassword(email, pw).catch((error) => {
        alert("Error de Autenticacion: ", error.message);
    })
    M.Modal.getInstance(modal__login).close();
    form__login.reset();
})

boton__logout.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            usuarioActual.innerHTML = " ";
            boton__logout.style.display = "none";
            document.getElementById("loginId").style.display = "block";
            mensaje.innerText = "Sesion Terminada...! Adios!";
            M.Modal.getInstance(modal__msg).open();
        }).catch((error) => alert(error));
    document.getElementById("loginId").style.visibility = "visible";
});

/* document.getElementById("signupId").addEventListener("click", () => {
    M.Modal.getInstance(modal__login).close();
}) */

//solo activar para permitir al admin registrar otras personas como admin
/* form__signup.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form__signup["signup-email"].value;
    const pw = form__signup["signup-password"].value;
    const credencial = await auth.createUserWithEmailAndPassword(email, pw);
    db
        .collection("users")
        .doc(credencial.user.uid)
        .set({
            bio: form__signup["signup-bio"].value,
        });

    auth.signInWithEmailAndPassword(email, pw).catch((error) => {
        alert("ocurrio un error: ", error.message);
    })
    M.Modal.getInstance(modal__signup).close();
    form__signup.reset();
}) */




