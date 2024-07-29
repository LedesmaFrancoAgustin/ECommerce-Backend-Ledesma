import fs from "node:fs";

class ProductManager {
    
    constructor(path) {
        this.path = path;
        this.productList = []
    }

    async getProductById(id){
        await this.getProductList();
        return this.productList.find(product => product.id === id);
    }

    async getProductList(limit = null) {
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.productList = [...JSON.parse(list).data];
        //console.log(this.productList); // Depuración
        
        if (limit) {
            return this.productList.slice(0, limit);
        } else {
            return [...this.productList];
        }
    }
    

    async addProduct(product){
        await this.getProductList();
        const newId = this.getNextId();
        const newProduct = {
            id: newId,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
        }
        this.productList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
    }

    async updateProduct(productID, updatedProduct){
        await this.getProductList();
        console.log("producto "+ updatedProduct)
        const index = this.productList.findIndex(p => p.id === Number(productID));
        if (index > -1) {
            this.productList[index] = {...this.productList[index],...updatedProduct};
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
            return true;
        }
    }

    async deleteProduct(productID){
        await this.getProductList();
        const index = this.productList.findIndex(p => p.id === Number(productID));
        if (index > -1) {
            this.productList.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
            return true;
        }
    }

    getNextId() {
        if (this.productList.length === 0) {
            return 1;
        } else {
            const ids = this.productList.map(product => product.id).filter(id => !isNaN(id));
            const maxId = Math.max(...ids);
            console.log("id : " + maxId);
            return isNaN(maxId) ? 1 : maxId + 1;
        }
    }
}

export default ProductManager;
