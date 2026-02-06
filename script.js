let allProducts = [],
  finalProducts = [],
  allCategories = [],
  category = "all",
  searchTerm = "",
  cart = [],
  currentProduct = null;
let productDiv = document.querySelector(".products"),
  categoryDiv = document.querySelector(".categoryList"),
  main = document.querySelector("main"),
  loader = document.querySelector(".loader"),
  sortSelect = document.getElementById("sortSelect"),
  searchInput = document.getElementById("searchInput"),
  cartPage = document.querySelector(".cartPage"),
  cartItemsContainer = document.querySelector(".cartItems"),
  cartTotalAmount = document.querySelector(".cartTotalAmount"),
  cartNavBtn = document.getElementById("cartNavBtn"),
  backBtn = document.querySelector(".backBtn"),
  toastContainer = document.querySelector(".toastContainer"),
  checkoutPage = document.querySelector(".checkoutPage"),
  checkoutBtn = document.getElementById("checkoutBtn"),
  checkoutBackBtn = document.querySelector(".checkoutBackBtn"),
  orderReviewItems = document.getElementById("orderReviewItems"),
  buyNowBtn = document.getElementById("buyNowBtn"),
  customerForm = document.getElementById("customerForm"),
  productDetailPage = document.querySelector(".productDetailPage"),
  productBackBtn = document.querySelector(".productBackBtn");
sortSelect.value = "default";

let getProducts = async () => {
  main.classList.add("hidden");
  loader.classList.remove("hidden");
  categoryDiv.innerHTML = ` <button class="active" value="all">All</button>`;
  let products = await fetch("https://fakestoreapi.com/products").then((r) =>
    r.json(),
  );
  allProducts = products;
  allCategories = [...new Set(products.map((p) => p.category))];
  getCategory();
  loader.classList.add("hidden");
  main.classList.remove("hidden");
  sortedProducts();
};

let getCategory = () => {
  allCategories.forEach(
    (cat) =>
      (categoryDiv.innerHTML += ` <button value="${cat}">${cat}</button>`),
  );
  document.querySelectorAll(".categoryList button").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      document.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");
      category = e.target.value;
      sortedProducts();
    }),
  );
};

let sortedProducts = () => {
  finalProducts = allProducts.filter(
    (p) =>
      (p.category === category || category === "all") &&
      p.title.toLowerCase().includes(searchTerm),
  );
  if (sortSelect.value !== "default")
    finalProducts.sort((a, b) =>
      sortSelect.value === "lowToHigh" ? a.price - b.price : b.price - a.price,
    );
  displayProducts();
};

sortSelect.addEventListener("change", () => sortedProducts());

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  sortedProducts();
});

let displayProducts = () => {
  productDiv.innerHTML = finalProducts
    .map((p) => {
      let ci = cart.find((i) => i.id === p.id);
      return `<div class="productCard" data-id="${p.id}">
      <div class="productImageWrapper"><div class="imageLoader"></div><img class="productImage hidden" src="${p.image}" alt="Product Image"></div>
      <div class="rating"><span>${p.category}</span></div><h3 class="pName">${p.title}</h3><p>$${p.price}</p>
      ${ci ? `<div class="productQtyControls"><button class="productQtyBtn productQtyDecrement" type="button">-</button><span class="productQtyValue">${ci.quantity}</span><button class="productQtyBtn productQtyIncrement" type="button">+</button></div>` : `<button class="fa fa-shopping-cart productCartBtn" type="button"></button>`}
    </div>`;
    })
    .join("");
  document.querySelectorAll(".productImage").forEach((img) =>
    img.addEventListener("load", function () {
      this.previousElementSibling.classList.add("hidden");
      this.classList.remove("hidden");
    }),
  );
};

let showProductDetail = (productId) => {
  currentProduct = allProducts.find((p) => p.id === productId);
  if (!currentProduct) return;
  let di = document.getElementById("productDetailImage"),
    dl = document.querySelector(".detailImageLoader");
  dl.classList.remove("hidden");
  di.classList.add("hidden");
  di.src = currentProduct.image;
  di.onload = () => {
    dl.classList.add("hidden");
    di.classList.remove("hidden");
  };
  document.getElementById("productDetailCategory").textContent =
    currentProduct.category;
  document.getElementById("productDetailName").textContent =
    currentProduct.title;
  document.getElementById("productDetailDescription").textContent =
    currentProduct.description;
  document.getElementById("productDetailPrice").textContent =
    "$" + currentProduct.price;
  let sc = document.getElementById("productDetailStars");
  sc.innerHTML = Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fa fa-star${i < Math.round(currentProduct.rating.rate) ? " filled" : ""}"></i>`,
  ).join("");
  let rp = document.getElementById("relatedProducts");
  rp.innerHTML = allProducts
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id,
    )
    .slice(0, 4)
    .map(
      (p) =>
        `<div class="relatedProductCard" data-id="${p.id}"><div class="productImageWrapper"><div class="imageLoader"></div><img class="hidden" src="${p.image}" alt="${p.title}"></div><span class="relatedProductCategory">${p.category}</span><h3 class="relatedProductName">${p.title}</h3><p class="relatedProductDescription">$${p.price}</p></div>`,
    )
    .join("");
  rp.querySelectorAll("img").forEach((img) =>
    img.addEventListener("load", function () {
      this.previousElementSibling.classList.add("hidden");
      this.classList.remove("hidden");
    }),
  );
  main.classList.add("hidden");
  cartPage.classList.add("hidden");
  checkoutPage.classList.add("hidden");
  productDetailPage.classList.remove("hidden");
};

let showView = (show, others = [], cb) => {
  [main, cartPage, productDetailPage, checkoutPage].forEach((el) =>
    el.classList.add("hidden"),
  );
  show.classList.remove("hidden");
  if (cb) cb();
};
let showProductsView = () => showView(main, [], displayProducts);
let showCartView = () => showView(cartPage, [], renderCart);
let showCheckoutView = () =>
  cart.length === 0
    ? showToast("Your cart is empty!", "error")
    : showView(checkoutPage, [], renderOrderReview);

let addToCart = (productId) => {
  let ei = cart.find((i) => i.id === productId);
  if (ei) ei.quantity++;
  else {
    let p = allProducts.find((x) => x.id === productId);
    if (!p) return;
    cart.push({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      category: p.category,
      quantity: 1,
    });
  }
  renderCart();
  displayProducts();
  showToast("Item added to cart!", "success");
};

let updateCartQuantity = (productId, delta) => {
  cart = cart
    .map((i) =>
      i.id === productId ? { ...i, quantity: i.quantity + delta } : i,
    )
    .filter((i) => i.quantity > 0);
  showToast(
    delta > 0 ? "Item added to cart!" : "Item removed from cart!",
    delta > 0 ? "success" : "error",
  );
  displayProducts();
  renderCart();
};

let removeFromCart = (productId) => {
  cart = cart.filter((i) => i.id !== productId);
  renderCart();
  displayProducts();
  showToast("Item removed from cart!", "error");
};

let renderCart = () => {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="emptyCartMessage">Your cart is empty.</p>';
    cartTotalAmount.textContent = "$0.00";
    return;
  }
  let t = 0;
  cartItemsContainer.innerHTML = cart
    .map((i) => {
      t += i.price * i.quantity;
      return `<article class="cartItem" data-id="${i.id}"><div class="cartItemImageWrapper"><img src="${i.image}" alt="${i.title}" class="cartItemImage" /><span class="cartItemCategory">${i.category}</span></div><div class="cartItemInfo"><h2 class="cartItemTitle">${i.title}</h2><p class="cartItemDescription">Quantity: ${i.quantity}</p><p class="cartItemPrice">$${i.price.toFixed(2)}</p></div><div class="cartItemActions"><button class="qtyBtn decrement" type="button">-</button><span class="qtyValue">${i.quantity}</span><button class="qtyBtn increment" type="button">+</button></div><button class="removeItemBtn" type="button" aria-label="Remove from cart"><i class="fa fa-trash-o"></i></button></article>`;
    })
    .join("");
  cartTotalAmount.textContent = `$${t.toFixed(2)}`;
};

let renderOrderReview = () => {
  if (cart.length === 0) {
    orderReviewItems.innerHTML =
      '<p class="emptyOrderMessage">No items to review.</p>';
    return;
  }
  orderReviewItems.innerHTML = cart
    .map(
      (i) =>
        `<article class="orderReviewItem"><div class="orderItemImageWrapper"><img src="${i.image}" alt="${i.title}" class="orderItemImage" /><span class="orderItemCategory">${i.category}</span></div><div class="orderItemInfo"><h2 class="orderItemTitle">${i.title}</h2><p class="orderItemDescription">Quantity: ${i.quantity}</p><p class="orderItemPrice">$${i.price.toFixed(2)}</p></div></article>`,
    )
    .join("");
};

cartNavBtn.addEventListener("click", showCartView);
backBtn.addEventListener("click", showProductsView);
checkoutBtn.addEventListener("click", showCheckoutView);
checkoutBackBtn.addEventListener("click", showCartView);

buyNowBtn.addEventListener("click", () => {
  let n = document.getElementById("customerName").value.trim(),
    m = document.getElementById("customerMobile").value.trim(),
    a = document.getElementById("customerAddress").value.trim(),
    p = document.getElementById("customerPincode").value.trim();
  if (!n || !m || !a || !p) {
    showToast("Please fill all the details!", "error");
    return;
  }
  let oid = "ORD" + Date.now(),
    pn = cart.map((i) => i.title).join(", "),
    tp = cart.reduce((s, i) => s + i.price * i.quantity, 0),
    pm =
      document.querySelector('input[name="paymentMethod"]:checked').value ===
      "cod"
        ? "Cash on Delivery"
        : "Card";
  document.getElementById("confirmOrderId").textContent = oid;
  document.getElementById("confirmProductName").textContent = pn;
  document.getElementById("confirmPrice").textContent = "$" + tp.toFixed(2);
  document.getElementById("confirmPaymentMode").textContent = pm;
  document.getElementById("confirmAddress").textContent = `${a}, ${p}`;
  document.getElementById("confirmDeliveryDate").textContent =
    "4 to 6 working days";
  cart = [];
  renderCart();
  displayProducts();
  customerForm.reset();
  [main, cartPage, productDetailPage, checkoutPage].forEach((el) =>
    el.classList.add("hidden"),
  );
  document.querySelector(".confirmationPage").classList.remove("hidden");
});

productDiv.addEventListener("click", (e) => {
  let c = e.target.closest(".productCard"),
    pid = c ? Number(c.getAttribute("data-id")) : null;
  if (!pid) return;
  if (
    e.target.classList.contains("fa-shopping-cart") ||
    e.target.classList.contains("productCartBtn")
  )
    addToCart(pid);
  else if (e.target.classList.contains("productQtyIncrement"))
    updateCartQuantity(pid, 1);
  else if (e.target.classList.contains("productQtyDecrement"))
    updateCartQuantity(pid, -1);
  else if (
    e.target.classList.contains("productImage") ||
    e.target.classList.contains("pName")
  )
    showProductDetail(pid);
});

cartItemsContainer.addEventListener("click", (e) => {
  let ci = e.target.closest(".cartItem"),
    pid = ci ? Number(ci.getAttribute("data-id")) : null;
  if (!pid) return;
  if (e.target.classList.contains("increment")) updateCartQuantity(pid, 1);
  else if (e.target.classList.contains("decrement"))
    updateCartQuantity(pid, -1);
  else if (
    e.target.classList.contains("removeItemBtn") ||
    e.target.closest(".removeItemBtn")
  )
    removeFromCart(pid);
});

let showToast = (msg, type) => {
  let t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  let tc = !productDetailPage.classList.contains("hidden")
    ? productDetailPage.querySelector(".toastContainer")
    : toastContainer;
  tc.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => tc.removeChild(t), 300);
  }, 2000);
};

document.getElementById("continueShoppingBtn").addEventListener("click", () => {
  document.querySelector(".confirmationPage").classList.add("hidden");
  main.classList.remove("hidden");
});
productBackBtn.addEventListener("click", () => {
  productDetailPage.classList.add("hidden");
  main.classList.remove("hidden");
});
document
  .getElementById("productDetailAddToCart")
  .addEventListener("click", () => {
    if (currentProduct) addToCart(currentProduct.id);
  });
document.getElementById("relatedProducts").addEventListener("click", (e) => {
  let rc = e.target.closest(".relatedProductCard");
  if (rc) showProductDetail(Number(rc.getAttribute("data-id")));
});

getProducts();
