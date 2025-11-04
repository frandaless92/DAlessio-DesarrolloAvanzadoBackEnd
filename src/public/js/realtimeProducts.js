const socket = io();

const form = document.getElementById("createProductForm");
const productsList = document.getElementById("productsList");
const filterForm = document.getElementById("filterForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  productData.price = parseFloat(productData.price);
  productData.stock = parseInt(productData.stock, 10);

  if (productData.thumbnails && productData.thumbnails.trim() !== "") {
    productData.thumbnails = [productData.thumbnails.trim()];
  } else {
    delete productData.thumbnails;
  }

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(`✅ Producto creado correctamente: ${result.product.title}`);
      form.reset();
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    alert("No se pudo crear el producto.");
  }
});

if (filterForm) {
  filterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const field = document.getElementById("filterField").value;
    const value = document.getElementById("filterValue").value.trim();

    if (!value) return alert("Por favor, ingresá un valor para buscar.");

    const params = new URLSearchParams({ [field]: value });

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      productsList.innerHTML = "";

      if (!data.products || data.products.length === 0) {
        productsList.innerHTML = "<li>No se encontraron productos.</li>";
        return;
      }

      data.products.forEach((product) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${product.title}</strong><br>
          <strong>Descripción:</strong> ${product.description}<br>
          <strong>Código:</strong> ${product.code}<br>
          <strong>Precio:</strong> $${product.price}<br>
          <strong>Stock:</strong> ${product.stock}<br>
          <strong>Categoría:</strong> ${product.category}<br>
          ${
            product.thumbnails && product.thumbnails.length > 0
              ? `<img src="${product.thumbnails[0]}" alt="${product.title}" width="100">`
              : ""
          }
          <button class="delete-btn" data-id="${
            product._id
          }">🗑️ Eliminar</button>
        `;
        productsList.appendChild(li);
      });
    } catch (err) {
      console.error("Error al filtrar productos:", err);
      alert("Error al aplicar el filtro.");
    }
  });
}

socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("li");
    productElement.innerHTML = `
      <strong>${product.title}</strong><br>
      <strong>Descripción:</strong> ${product.description}<br>
      <strong>Código:</strong> ${product.code}<br>
      <strong>Precio:</strong> $${product.price}<br>
      <strong>Stock:</strong> ${product.stock}<br>
      <strong>Categoría:</strong> ${product.category}<br>
      ${
        product.thumbnails && product.thumbnails.length > 0
          ? `<img src="${product.thumbnails[0]}" alt="${product.title}" width="100">`
          : ""
      }
      <button class="delete-btn" data-id="${product._id}">🗑️ Eliminar</button>
    `;
    productsList.appendChild(productElement);
  });
});

productsList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.getAttribute("data-id");

    const userConfirmed = confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (userConfirmed) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        const result = await response.json();

        if (!response.ok) {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto.");
      }
    }
  }
});
