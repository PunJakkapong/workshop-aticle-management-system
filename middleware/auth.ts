export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem("token");
    if (!token && to.path !== "/login" && to.path !== "/register") {
      return navigateTo("/login");
    }
  }
});
