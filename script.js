let allProducts = [];
let allCategories = [];
let category = "all";
let productDiv = document.querySelector(".products");
let categoryDiv = document.querySelector(".categoryList");
let main = document.querySelector("main");
let loader = document.querySelector(".loader");

let getProducts = async () => {
  // productDiv.innerHTML = "";
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

  displayProducts();
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
    displayProducts();
  };

  categoryButtons.forEach((button) =>
    button.addEventListener("click", categoryCard)
  );
};

let displayProducts = () => {
  productDiv.innerHTML = "";
  allProducts.forEach((element) => {
    if (element.category === category || category === "all") {
      console.log(element.category);
      productDiv.innerHTML += `<div class="productCard">
                <img class="" src="${element.image}"
                    alt="Product Image">
                <div class="rating">
                    <span>${element.category}</span>
                </div>
                <h3 class="pName">${element.title}</h3>
                <p>$${element.price}</p>
                <button type="button">Add to Cart</button>
            </div>`;
    }
  });
};

getProducts();
