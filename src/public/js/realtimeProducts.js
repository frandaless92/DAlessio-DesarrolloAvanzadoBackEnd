const socket = io();

const form = document.getElementById("createProductForm");
const productsList = document.getElementById("productsList");

//Envío del formulario para crear productos
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
    delete productData.thumbnails; // Si está vacío, no lo enviamos
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
      alert(`Producto creado correctamente: ${result.product.title}`);
      form.reset();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    alert("No se pudo crear el producto.");
  }
});

//Escuchamos el evento 'updateProducts' para renderizar la lista
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
        <button class="delete-btn" data-id="${product.id}">🗑️ Eliminar</button>
    `;
    productsList.appendChild(productElement);
  });
});

// Manejo de eliminación de productos

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
