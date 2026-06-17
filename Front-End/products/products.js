
/*let pageNumber = 1;
const pageSize = 5;

const loadFlowers = async () => {
    try {
        const response = await fetch(`http://localhost:5035/api/Products/GetHomeFlowers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            console.log('No flowers found.');
            return;
        }

        const productGrid = document.getElementById('product-grid');
        
        data.items.forEach(flower => {
            const flowerItem = document.createElement('div');
            flowerItem.className = 'flower-item';
            
            flowerItem.innerHTML = `
                <input type="hidden" value="${flower.id}" id="product-id-${flower.id}"> <!-- Hidden ID -->
                <img src="http://localhost:5035/${flower.imagePath}" alt="${flower.name}">
                <h3>${flower.name}</h3>
                <p>Type: ${flower.type}</p>
                <p>Price: $${flower.price}</p>
                <p>Quantity: ${flower.quantity}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${flower.id})">Add to Cart</button>
                <button class="remove-from-cart-btn" onclick="removeFromCart(${flower.id})">Remove from Cart</button>
            `;
            
            productGrid.appendChild(flowerItem);
        });
        
        pageNumber++;
    } catch (error) {
        console.error('Error loading flowers:', error);
    }
};

function addToCart(id) {
  var token = sessionStorage.getItem("token");

  if (!token) {
      Swal.fire("Unauthorized", "Please log in first", "warning");
      return;
  }

  fetch(`http://localhost:5035/api/Cart/AddProduct/${id}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Failed to add product to cart.");
      }
      return response.json();
  })
  .then(data => {
      console.log("Product added to cart:", data);
      Swal.fire("Success", "Product added to cart successfully!", "success");
  })
  .catch(error => {
      console.error("Error adding product:", error);
      Swal.fire("Error", error.message, "error");
  });
}

function removeFromCart(id) {
  var token = sessionStorage.getItem("token");

  if (!token) {
      Swal.fire("Unauthorized", "Please login first", "warning");
      return;
  }

  fetch(`http://localhost:5035/api/Cart/RemoveProduct/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Failed to remove product from cart.");
      }
      Swal.fire("Success", "Product removed from cart", "success");
  })
  .catch(error => {
      console.error("Error:", error);
      Swal.fire("Error", error.message, "error");
  });
}


document.getElementById('loadMore').addEventListener('click', loadFlowers);

// Load initial set of flowers
loadFlowers();
//--------------------------------------------------------------------
// إضافة حدث على الـ input

const searchBtn = document.querySelector('.search-btn');
const searchField = document.querySelector('.search-field');
const productMain = document.querySelector('.product-main');
const searchResults = document.getElementById('searchResults');

searchBtn.addEventListener('click', function () {
  const keyword = searchField.value.trim();

  if (keyword) {
    fetch(`http://localhost:5035/api/Products/SearchByName?keyword=${keyword}`)
      .then(response => response.json())
      .then(data => {
        // أخفي المنتجات الأصلية واظهر نتائج البحث
        productMain.style.display = 'none';
        searchResults.style.display = 'block';
        searchResults.innerHTML = '';

        if (data.length === 0) {
          searchResults.innerHTML = `<p>No products found for "${keyword}".</p>`;
          return;
        }

        data.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product-card');

          productDiv.innerHTML = `
            <img src="http://localhost:5035/${product.imagePath}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p>Type: ${product.type}</p>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Description: ${product.description}</p>
          `;

          searchResults.appendChild(productDiv);
        });
      })
      .catch(error => console.error("Search error:", error));
  } else {
    // لو المستخدم مسح البحث نرجّع الصفحة زي ما كانت
    productMain.style.display = 'block';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
});

// نضيف حدث لو المستخدم مسح الكلمة من البحث نرجع المنتجات الأصلية
searchField.addEventListener('input', function () {
  if (searchField.value.trim() === '') {
    productMain.style.display = 'block';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
});






//--------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribe-form');
    const newsletterHeader = document.querySelector('.newsletter-header');
    const thankYouBtn = document.getElementById('thank-you-btn');
    const subscribedEmail = localStorage.getItem('subscribedEmail');
    if (subscribedEmail) {
        newsletterHeader.style.display = 'none';
        thankYouBtn.style.display = 'block'; 
    }
    subscribeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const email = document.querySelector('.email-field').value;
  
        if (email) {
            localStorage.setItem('subscribedEmail', email);
            newsletterHeader.style.display = 'none';
            thankYouBtn.style.display = 'block'; 
        }
    });
  });
  const modal = document.querySelector('[data-modal]');
  const modalCloseBtn = document.querySelector('[data-modal-close]');
  const modalCloseOverlay = document.querySelector('[data-modal-overlay]');
  const subscribeForm = document.getElementById('subscribe-form');
  const thankYouBtn = document.getElementById('thank-you-btn');
  
  
  const modalCloseFunc = function () {
    modal.classList.add('closed');
  };
  
  
  if (localStorage.getItem('subscribed') === 'true') {
    modal.classList.add('closed');
  }
  
  
  modalCloseOverlay.addEventListener('click', modalCloseFunc);
  modalCloseBtn.addEventListener('click', modalCloseFunc);
  
  
  subscribeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    localStorage.setItem('subscribed', 'true'); 
  
   
    thankYouBtn.style.display = 'block';
    subscribeForm.style.display = 'none';
  
    setTimeout(modalCloseFunc, 2000); 
  });
  const notificationToast = document.querySelector('[data-toast]');
  const toastCloseBtn = document.querySelector('[data-toast-close]');
  toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
  });
  const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
  const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
  const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
  const overlay = document.querySelector('[data-overlay]');
  
  for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
    const mobileMenuCloseFunc = function () {
      mobileMenu[i].classList.remove('active');
      overlay.classList.remove('active');
    }
  
    mobileMenuOpenBtn[i].addEventListener('click', function () {
      mobileMenu[i].classList.add('active');
      overlay.classList.add('active');
    });
  
    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);
  
  }
  const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
  const accordion = document.querySelectorAll('[data-accordion]');
  
  for (let i = 0; i < accordionBtn.length; i++) {
  
    accordionBtn[i].addEventListener('click', function () {
  
      const clickedBtn = this.nextElementSibling.classList.contains('active');
  
      for (let i = 0; i < accordion.length; i++) {
  
        if (clickedBtn) break;
  
        if (accordion[i].classList.contains('active')) {
  
          accordion[i].classList.remove('active');
          accordionBtn[i].classList.remove('active');
  
        }
  
      }
  
      this.nextElementSibling.classList.toggle('active');
      this.classList.toggle('active');
  
    });
  
  }
  var header=document.querySelector(".header-alert-news")
  var profile=document.querySelector(".header-alert")
  
  var firstName = localStorage.getItem("savedFirstName");
  var lastName = localStorage.getItem("savedLastName");
  
  if (firstName && lastName) {
         
    header.remove();
  
   
    profile.style.display = "block";
    profile.innerHTML = '<span style="color: palevioletred; font-weight: bold;">welcome 🤗</span>'+" " +firstName + " " + lastName; 
    
  }else {
    console.log("No user is logged in");
  }
  
  var person=document.querySelector(".action-btn-person")
  var per=document.querySelector(".header-person")
  
  var firstName = localStorage.getItem("savedFirstName");
  
  if (firstName ) {
         
    person.remove();
  
   
    per.style.display = "block";
    per.innerHTML = firstName; 
    
  }else {
    console.log("No user is logged in");
  }
  var out=document.querySelector("#sign-out")
  out.click=localStorage.clear()
  
  
  function loadProducts() {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    var container = document.getElementById("product-container");

    if (products.length === 0) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }

    products.forEach(product => {
      container.innerHTML += `
        <div class="product-box">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
        </div>
      `;
    });
  }

  loadProducts();*/
  // الاول 
//------------------------------------------------------------------------------------------------------------
  
// Cart functionality
// الى شغال فية الكارت 


/*document.addEventListener("DOMContentLoaded", () => {
    const signinMenu = document.getElementById("signin-menu");

    const token = sessionStorage.getItem("token");

    if (token && signinMenu) {
        // لو في توكن، غيري النص ليظهر تسجيل الخروج
        signinMenu.innerHTML = '<p>Logout 👋</p>';
        signinMenu.href = "#"; // منع التنقل الافتراضي للرابط

        signinMenu.addEventListener("click", function (e) {
            e.preventDefault(); // نمنع التنقل للرابط
            Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, logout",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("userName"); // لو عايز تمسح الاسم كمان
                    Swal.fire("Logged out", "You have been logged out", "success").then(() => {
                        window.location.href = "signin.html"; // توجه لصفحة تسجيل الدخول
                    });
                }
            });
        });
    }
});*/
/*
window.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("role"); // جلب الدور من السيشن
  if(role === "Admin"){
    document.getElementById("dashboard-menu").style.display = "block"; // عرض الزرار لو أدمن
  }
});*/
/////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const signinMenu = document.getElementById("signin-menu");
  const token = sessionStorage.getItem("token");

  if (token && signinMenu) {
    // لما يكون في توكن نخفي عنصر تسجيل الدخول
    signinMenu.style.display = "none";
  }
});


window.addEventListener('DOMContentLoaded', () => {
  // نجيب الاسم من السيشن بالـ key الصح
  const fullName = sessionStorage.getItem('userName');
  
  if (!fullName) {
    console.log('No userName found in sessionStorage');
    return;
  }

  // ناخد أول كلمة (الاسم الأول)
  const firstName = fullName.split(' ')[0];

  // نجيب العنصر اللي هنعرض فيه الاسم
  const userNameDisplay = document.getElementById('userNameDisplay');
  
  if (!userNameDisplay) {
    console.log('Element with id "userNameDisplay" not found');
    return;
  }

  // نعرض كلمة "welcom 👋:" باللون ونخلي الاسم بعديها
  userNameDisplay.innerHTML = `<span style="color: palevioletred; font-weight: bold;">welcom 👋: </span>${firstName}`;

  // نتأكد ان العنصر ظاهر ولو فيه أي تعديل ستايل
  userNameDisplay.style.display = 'inline-block';
  userNameDisplay.style.marginLeft = 'auto';
  userNameDisplay.style.fontWeight = 'bold';
});



/////////////////////////////////////////////////////////////
  let pageNumber = 1;
  const pageSize = 5;
  let cartItems = [];
  
  const loadCart = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch("http://localhost:5035/api/Cart/GetCart", {
          headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.ok) {
          const data = await response.json();
          cartItems = data.cartItems || [];
      } else {
          cartItems = []; // لو الكارت فاضي
      }
  
      // تحديث واجهة الكارت داخل ul
      const cartContainer = document.getElementById("cart-items-list");
      cartContainer.innerHTML = "";
  
      cartItems.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `${item.productName} - Quantity: ${item.quantity} - Price: $${item.price}`;
          cartContainer.appendChild(li);
      });
  };
  
  const getQuantityInCart = (productId) => {
      const item = cartItems.find(ci => ci.productId === productId);
      return item ? item.quantity : 0;
  };
  
  const loadFlowers = async () => {
      try {
          await loadCart();
  
          const response = await fetch(`http://localhost:5035/api/Products/GetHomeFlowers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
          const data = await response.json();
  
          const productGrid = document.getElementById('product-grid');
  
          data.items.forEach(flower => {
              const quantityInCart = getQuantityInCart(flower.id);
              const flowerItem = document.createElement('div');
              flowerItem.className = 'flower-item';
  
              flowerItem.innerHTML = `
                  <img src="http://localhost:5035/${flower.imagePath}" alt="${flower.name}">
                  <h3>${flower.name}</h3>
                  <p>Type: ${flower.type}</p>
                  <p>Suitable for: ${flower.occasion || "Any occasion"}</p>
                  <p>Price: $${flower.price}</p>
                  <p>Quantity Available: ${flower.quantity}</p>
                  <p class="cart-quantity" id="quantity-${flower.id}">In Cart: ${quantityInCart}</p>
                  <button class="add-btn" data-id="${flower.id}">➕ Add to Cart</button>
                  <button class="remove-btn" data-id="${flower.id}">➖ Remove</button>
              `;
  
              productGrid.appendChild(flowerItem);
          });
  
          document.querySelectorAll('.add-btn').forEach(btn => {
              btn.addEventListener('click', async () => {
                  const productId = parseInt(btn.dataset.id);
                  const token = sessionStorage.getItem("token");
  
                  if (!token) {
                      alert("You must log in first.");
                      return;
                  }
  
                  const res = await fetch(`http://localhost:5035/api/Cart/AddProduct/${productId}`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                      }
                  });
  
                  if (res.status === 401) {
                      alert("You must log in first.");
                      return;
                  }
  
                  if (res.status === 404) {
                      alert("Product not found.");
                      return;
                  }
  
                  if (res.ok) {
                      await loadCart();
                      const quantity = getQuantityInCart(productId);
                      document.getElementById(`quantity-${productId}`).textContent = `In Cart: ${quantity}`;
                  }
              });
          });
  
          document.querySelectorAll('.remove-btn').forEach(btn => {
              btn.addEventListener('click', async () => {
                  const productId = parseInt(btn.dataset.id);
                  const token = sessionStorage.getItem("token");
  
                  const res = await fetch(`http://localhost:5035/api/Cart/RemoveProduct/${productId}`, {
                      method: "DELETE",
                      headers: {
                          "Authorization": `Bearer ${token}`
                      }
                  });
  
                  if (res.ok) {
                      await loadCart();
                      const quantity = getQuantityInCart(productId);
                      document.getElementById(`quantity-${productId}`).textContent = `In Cart: ${quantity}`;
                  }
              });
          });
  
          pageNumber++;
      } catch (error) {
          console.error("Error:", error);
      }
  };
  
  document.getElementById('loadMore').addEventListener('click', loadFlowers);
  loadFlowers(); 
  


  const searchBtn = document.querySelector('.search-btn');
const searchField = document.querySelector('.search-field');
const productMain = document.querySelector('.product-main');
const searchResults = document.getElementById('searchResults');

searchBtn.addEventListener('click', function () {
  const keyword = searchField.value.trim();

  if (keyword) {
    fetch(`http://localhost:5035/api/Products/SearchByName?keyword=${keyword}`)
      .then(response => response.json())
      .then(data => {
        // أخفي المنتجات الأصلية واظهر نتائج البحث
        productMain.style.display = 'none';
        searchResults.style.display = 'flex';

        searchResults.innerHTML = '';

        if (data.length === 0) {
          searchResults.innerHTML = `<p>No products found for "${keyword}".</p>`;
          return;
        }

        data.forEach(product => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product-card');

          productDiv.innerHTML = `
            <img src="http://localhost:5035/${product.imagePath}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p>Type: ${product.type}</p>
            <p>Suitable for: ${product.occasion || "Any occasion"}</p>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
           
          `;

          searchResults.appendChild(productDiv);
        });
      })
      .catch(error => console.error("Search error:", error));
  } else {
    // لو المستخدم مسح البحث نرجّع الصفحة زي ما كانت
    productMain.style.display = 'block';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
});

// نضيف حدث لو المستخدم مسح الكلمة من البحث نرجع المنتجات الأصلية
searchField.addEventListener('input', function () {
  if (searchField.value.trim() === '') {
    productMain.style.display = 'block';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
});


  //--------------------------------------------------------------------------------------

  document.getElementById("next-btn").addEventListener("click", () => {
    // هنخزن البيانات في sessionStorage مؤقتًا
    sessionStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    // نروح على صفحة التحقق
    window.location.href = "checkout.html";
  });


// --- Dynamic Occasions for Home Page ---
function loadDynamicOccasions() {
  const occasionsContainer = document.getElementById("dynamic-home-occasions");
  if (!occasionsContainer) return;

  const occasionImages = {
    "Wedding": "flower/rose.jpg",
    "Birthday": "flower/sunflower.jpg",
    "Sympathy": "flower/lilies.jpg",
    "Anniversary": "flower/tulip.jpg",
    "Congratulations": "flower/gerberas.jpg"
  };

  const defaultImage = "flower/rose.jpg";

  fetch('http://localhost:5035/api/Occasions/GetAllOccasions')
    .then(res => res.json())
    .then(data => {
      occasionsContainer.innerHTML = '';
      data.forEach(occ => {
        const imageUrl = occasionImages[occ.name] || defaultImage;
        const occasionHtml = `
          <a href="occasions.html?occasion=${encodeURIComponent(occ.name)}#occasion-products" class="home-occasion-card">
            <img src="${imageUrl}" alt="${occ.name} flowers">
            <span>${occ.name}</span>
          </a>
        `;
        occasionsContainer.innerHTML += occasionHtml;
      });
    })
    .catch(err => console.error('Error loading home occasions:', err));
}
loadDynamicOccasions();
