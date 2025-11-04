const productList = document.getElementById("productsList");
const cartId = productList.dataset.cartId;

document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pid = btn.dataset.pid;
    const input = document.querySelector(`.quantity-input[data-pid='${pid}']`);
    const quantity = parseInt(input.value, 10);

    if (!quantity || quantity <= 0) {
      alert("Cantidad inválida");
      return;
    }

    try {
      console.log("Cart ID:", cartId);
      const res = await fetch(`/api/carts/${cartId}`, {
        method: "GET",
      });
      const { cart } = await res.json();

      // Si el producto ya está, sumamos cantidad
      const existing = cart.products.find((p) => p.product._id === pid);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      // Actualizamos carrito con el nuevo array de productos
      await fetch(`/api/carts/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cart.products }),
      });

      alert("Producto agregado al carrito correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Error al agregar producto al carrito");
    }
  });
});
