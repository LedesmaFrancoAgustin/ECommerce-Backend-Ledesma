import fs from "node:fs";

class CartManager {
    
    constructor(path) {
        this.path = path;
        this.cartList = []
    }

    async addCart(cart) {
        await this.getCartList();
        const newId = this.getNextId();
        const newCart = {
            idCart: newId,
            products: cart.products,
        }
        this.cartList.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.cartList}));

    }

    async  addProductToCart(cid, pid) {
        // Obtener el carrito por ID
        await this.getCartById(cid);
        // Encontrar el carrito
        const cart = this.cartList.find(c => c.idCart === cid);
        // Verificar si el carrito existe
        if (cart) {
            // Verificar si pid es un objeto con idProduct y quantity
                const existingProduct = cart.products.find(p => p.idProduct === pid);
    
                if (existingProduct) {
                    // Si el producto ya existe, sumar la cantidad
                    existingProduct.quantity += 1;
                } else {
                    // Si el producto no existe, agregarlo al carrito
                    cart.products.push({ idProduct: pid, quantity: 1 });
                }
    
                await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartList }));

                return true;
          
        } else {
            throw new Error("El carrito no existe");
        }
    }
    
    
    async getCartById(id){
        await this.getCartList();
        return this.cartList.find(cart => cart.idCart === id);
    }

    async getCartList(limit = null) {
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.cartList = [...JSON.parse(list).data];
        //console.log(this.cartList); 
        
        if (limit) {
            return this.cartList.slice(0, limit);
        } else {
            console.log("Entro");
            return [...this.cartList];
        }
    }

    getNextId() {
        if (this.cartList.length === 0) {
            return 1;
        } else {
            const ids = this.cartList.map(cart => cart.idCart).filter(id => !isNaN(id));
            const maxId = Math.max(...ids);
            console.log("id : " + maxId);
            return isNaN(maxId) ? 1 : maxId + 1;
        }
    }
}

export default CartManager;