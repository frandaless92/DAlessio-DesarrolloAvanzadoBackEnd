document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (confirm("¿Seguro que querés eliminar este carrito?")) {
      try {
        const res = await fetch(`/api/carts/remove/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("Carrito eliminado correctamente");
          location.reload();
        } else {
          alert("Error al eliminar carrito");
        }
      } catch (err) {
        alert("Error al eliminar carrito");
      }
    }
  });
});
