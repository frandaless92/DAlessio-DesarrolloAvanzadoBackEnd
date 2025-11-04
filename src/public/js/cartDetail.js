const productList = document.getElementById("productList");
if (productList) {
  const cartId = productList.dataset.cartId;

  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.pid;
      const input = document.querySelector(
        `.quantity-input[data-pid='${pid}']`
      );
      const quantity = parseInt(input.value, 10);
      if (quantity <= 0) return alert("Cantidad inválida");

      const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (res.ok) {
        alert("Cantidad actualizada correctamente");
        location.reload();
      } else {
        alert("Error al actualizar cantidad");
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const pid = e.target.dataset.pid;
      if (!pid) return;
      if (!confirm("¿Eliminar este producto?")) return;

      const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Producto eliminado correctamente");
        location.reload();
      } else {
        alert("Error al eliminar producto");
      }
    });
  });

  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      if (!confirm("¿Vaciar todos los productos del carrito?")) return;

      const res = await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Carrito vaciado correctamente");
        location.reload();
      } else {
        alert("Error al vaciar carrito");
      }
    });
  }
}
