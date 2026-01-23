let allProducts = [];
let finalProducts = [];
let allCategories = [];
let category = "all";
let searchTerm = "";
let searchBar = document.querySelector("#searchInput");
let productDiv = document.querySelector(".products");
let categoryDiv = document.querySelector(".categoryList");
let main = document.querySelector("main");
let loader = document.querySelector(".loader");
let sortSelect = document.getElementById("sortSelect");
sortSelect.value = "default";

let getProducts = async () => {
  // productDiv.innerHTML = "";
  console.log("Fetching Products...");
  main.classList.add("hidden");
  loader.classList.remove("hidden");
  categoryDiv.innerHTML = ` <button class="active" value="all">All</button>`;
  let response = await fetch("https://fakestoreapi.com/products");
  let products = await response.json();
  allProducts = products;
  console.log(products);

  products.forEach((element) => {
    if (!allCategories.includes(element.category)) {
      allCategories.push(element.category);
    }
  });

  getCategory();

  loader.classList.add("hidden");
  main.classList.remove("hidden");

  sortedProducts();
};

let getCategory = () => {
  allCategories.forEach((category) => {
    categoryDiv.innerHTML += ` <button value="${category}">${category}</button>`;
  });
  let categoryButtons = document.querySelectorAll(".categoryList button");
  console.log(categoryButtons);

  let categoryCard = (e) => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    category = e.target.value;
    console.log(category);
    sortedProducts();
  };

  categoryButtons.forEach((button) =>
    button.addEventListener("click", categoryCard)
  );
};

let sortedProducts = () => {
  finalProducts = [];
  let sortedProducts = [];
  allProducts.forEach((product) => {

    const categoryMatch = product.category === category || category === "all"
    const searchMatch = product.title.toLowerCase().includes(searchTerm)

    if (categoryMatch && searchMatch) {
      finalProducts.push(product);
    }
  });
  if (sortSelect.value === "default") {
    sortedProducts = finalProducts;
  } else if (sortSelect.value === "lowToHigh") {
    sortedProducts = finalProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "highToLow") {
    sortedProducts = finalProducts.sort((a, b) => b.price - a.price);
  }

  finalProducts = sortedProducts;
  console.log("Sorted Products:");
  console.log(finalProducts);
  displayProducts();
};

sortSelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  sortedProducts();
});

searchBar.addEventListener("input",(e)=>{
    searchTerm = e.target.value.toLowerCase();
    console.log(searchTerm);
    sortedProducts();
})

let displayProducts = () => {
    productDiv.innerHTML = "";
    // productDiv.innerHTML = `<div class="productCard">
                  
    //               <div class="productImage">
    //                   <div class="loader hidden"></div>
    //                       <img class=""
    //                           src="https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //                           alt="Product Image"> 
    //               </div>
  
    //               <div class="rating">
    //                   <span>4.5</span>
    //               </div>
    //               <h3 class="pName">Product Name</h3>
    //               <p>$19.99</p>
    //               <button class="fa fa-shopping-cart" type="button"></button>
    //           </div>`;
    finalProducts.forEach((element) => {
    productDiv.innerHTML += `<div class="productCard">
    <div class="productImage">
                <div class="loader"></div>
                <img class="hidden" src="${element.image}"
                    alt="Product Image">
                    </div>
                <div class="rating">
                    <span>${element.category}</span>
                </div>
                <h3 class="pName">${element.title}</h3>
                <p>$${element.price}</p>
                <button class="fa fa-shopping-cart" type="button"></button>
            </div>`;
  });
  let productImage = document.querySelectorAll("img");
  let loadingStatus = document.querySelectorAll(".loader");
  console.log(productImage);
  console.log(loadingStatus);

  productImage.forEach(async (img, index) => {
    img.addEventListener("load", () => {
          loadingStatus[index + 1].classList.add("hidden");
          img.classList.remove("hidden");
      });
  });

  console.log(productImage);
  console.log(loadingStatus);
};

getProducts();
