let allProducts = [];
let finalProducts = [];
let allCategories = [];
let category = "all";
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
    if (product.category === category || category === "all") {
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
    sortedProducts()

})

let displayProducts = () => {
    productDiv.innerHTML = "";
  finalProducts.forEach((element) => {
      productDiv.innerHTML += `<div class="productCard">
                <img class="productImage" src="${element.image}"
                    alt="Product Image">
                <div class="rating">
                    <span>${element.category}</span>
                </div>
                <h3 class="pName">${element.title}</h3>
                <p>$${element.price}</p>
                <button class="fa fa-shopping-cart" type="button"></button>
            </div>`;

            let productImage = document.querySelectorAll(".productImage");
            console.log(productImage);
  });
};

getProducts();
