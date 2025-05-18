import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

import LoginPage from "@/views/Auth/LoginPage.vue";
import RegisterPage from "@/views/Auth/RegisterPage.vue";
import RegistrationFormPage from "@/views/Auth/RegistrationFormPage.vue";
import HomePage from "@/views/Home/HomePage.vue";
import DashboardUMKM from "@/views/Umkm/DashboardUMKM.vue";
import DashboardWilayah from "@/views/Wilayah/DashboardWilayah.vue";
import UMKMDetail from "@/views/UMKM/UMKMDetail.vue";
import AsetDetail from "@/views/Wilayah/AsetDetail.vue";
import UploadViewPage from "@/views/UMKM/ImageUploader.vue";
import AddUMKMPage from "@/views/UMKM/AddUMKM.vue";
import AddPemilik from "@/views/All/PemilikForm.vue";
import KoordinatUMKM from "@/views/UMKM/KoordinatForm.vue";
import KontakForm from "@/views/UMKM/KontakForm.vue";

const routes = [
  { path: "/login", name: "login", component: LoginPage },
  { path: "/register", name: "register", component: RegisterPage },
  {
    path: "/complete-registration",
    name: "registration-form",
    component: RegistrationFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/umkm/dashboard",
    name: "dashboard-umkm",
    component: DashboardUMKM,
    meta: { requiresAuth: true },
  },
  {
    path: "/wilayah/dashboard",
    name: "dashboard-wilayah",
    component: DashboardWilayah,
    meta: { requiresAuth: true },
  },
  {
    path: "/umkm/:id",
    name: "umkm-detail",
    component: UMKMDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/wilayah/:id",
    name: "aset-detail",
    component: AsetDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/uploadView",
    name: "uploadView",
    component: UploadViewPage,
  },
  {
    path: "/addumkm",
    name: "addumkm",
    component: AddUMKMPage,
  },
  {
    path: "/pemilik",
    name: "pemilik",
    component: AddPemilik,
  },
  {
    path: "/koordinatumkm",
    name: "koordinatumkm",
    component: KoordinatUMKM
  },
  {
    path: "/kontak",
    name: "kontak",
    component: KontakForm,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
