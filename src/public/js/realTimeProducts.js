const socket = io();

const containerProducts = document.querySelector("#cartsProducts")

document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    addProduct(); // Llama a la función addProduct
});

document.getElementById('updateProductForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    updateProductForm(); // Llama a la función addProduct
});

document.getElementById('clearProductForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    clearProductForm(); // Llama a la función addProduct
});

socket.on('realTimeProducts', (products) => {
    containerProducts.innerHTML = '';
    console.log("Entro socket on - realTimeProducts");

    products.forEach((product) => {
        const divProduct = document.createElement('div');
        divProduct.classList.add(product.id, 'cortProduct');

        const productTemplate = `
            <p>ID: ${product.id}</p>
            <p>Title: ${product.title}</p>
            <p>Description: ${product.description}</p>
            <p>Code: ${product.code}</p>
            <p>Price: ${product.price}</p>
            <p>Status: ${product.status}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
            <p>Thumbnails: ${product.thumbnails}</p>
        `;

        divProduct.innerHTML = productTemplate;
        containerProducts.appendChild(divProduct);
    });
});




function  addProduct  ()  {
    console.log("Entro addProduct")

    //const id = document.getElementById("id").value
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const code = document.getElementById("code").value
    const price = document.getElementById("price").value
    const status = document.getElementById("status").value
    const stock = document.getElementById("stock").value
    const category = document.getElementById("category").value
    const thumbnails = document.getElementById("thumbnails").value

    const productDetail = {title,description,code,price,status,stock,category,thumbnails}

    socket.emit("addProductToCart", productDetail)

    document.getElementById("addProductForm").reset();

}

function updateProductForm (){

    console.log("Entro updateProductForm")

    const id = document.getElementById("updateId").value
    const title = document.getElementById("updateTitle").value
    const description = document.getElementById("updateDescription").value
    const code = document.getElementById("updateCode").value
    const price = document.getElementById("updatePrice").value
    const status = document.getElementById("updateStatus").value
    const stock = document.getElementById("updateStock").value
    const category = document.getElementById("updateCategory").value
    const thumbnails = document.getElementById("updateThumbnails").value

    const productUpdate ={"id":id,"title": title, "description": description, "code": code, "price": price, "status": status, "stock": stock, "category": category, "thumbnails": thumbnails}

    socket.emit("updateProductForm", productUpdate)

    document.getElementById("updateProductForm").reset();

}

function clearProductForm (){

    const id = document.getElementById("clearId").value

    socket.emit("clearProductForm", id)
 
    document.getElementById("clearProductForm").reset();
 
}
