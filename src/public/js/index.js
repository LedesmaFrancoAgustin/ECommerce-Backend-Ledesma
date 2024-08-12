
const socket = io();

document.getElementById('addProductFormMongo').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    addProduct(); // Llama a la función addProduct
});


function  addProduct  ()  {
    console.log("Entro addProduct")

    //const id = document.getElementById("id").value
    const idProduct = document.getElementById("idProduct").value
    const quantity = document.getElementById("quantity").value


    const product = {idProduct,quantity}

  
    socket.emit("addProductToCartMongo", product)


}