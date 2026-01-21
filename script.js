let allProducts =[]
let productDiv = document.querySelector('.products');

let getProducts= async()=>{
    productDiv.innerHTML = "";
    let response= await fetch('https://fakestoreapi.com/products')
    let products = await response.json();
    allProducts = products;
    console.log(products);
    
    products.forEach(element => {
        productDiv.innerHTML += `<div class="productCard">
                <img src="${element.image}"
                    alt="Product Image">
                <h3 class="pName">${element.title}</h3>
                <p>Rs.${element.price}</p>
                <button type="button">Add to Cart</button>
            </div>`
    });
}


getProducts();