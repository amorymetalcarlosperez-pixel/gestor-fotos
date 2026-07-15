export async function shareZip() {

  alert("Entrando en shareZip");

  if (!navigator.share) {

    alert("navigator.share NO existe");

    return;

  }

  alert("navigator.share existe");

  try {

    await navigator.share({

      title: "Prueba",

      text: "Hola desde Gestor Fotos"

    });

    alert("Compartido");

  }

  catch (e) {

    console.error(e);

    alert("Cancelado o error");

  }

}