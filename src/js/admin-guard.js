const u = sessionStorage.getItem("wedding_auth_user");
if (!u || (u !== "ana" && u !== "leo")) {
  window.location.href = "index.html";
}
