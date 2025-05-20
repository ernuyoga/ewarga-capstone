import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

import LoginPage from "@/views/Auth/LoginPage.vue";
import RegisterPage from "@/views/Auth/RegisterPage.vue";
import RegistrationFormPage from "@/views/Auth/RegistrationFormPage.vue";
import HomePage from "@/views/Home/HomePage.vue";
import DashboardUMKM from "@/views/UMKM/DashboardUMKM.vue";
import DashboardWilayah from "@/views/Wilayah/DashboardWilayah.vue";
import UMKMDetail from "@/views/UMKM/UMKMDetail.vue";
import AsetDetail from "@/views/Wilayah/AsetDetail.vue";
import ProdukDetail from "@/views/UMKM/ProdukDetail.vue";
import PenghuniDetail from "@/views/Wilayah/PenghuniDetail.vue";
import UploadViewPage from "@/views/UMKM/UMKMImage.vue";
import AddUMKMPage from "@/views/UMKM/UMKMAdd.vue";
import AddPemilik from "@/views/UMKM/UMKMPemilik.vue";
import KoordinatUMKM from "@/views/UMKM/UMKMKoordinat.vue";
import KontakForm from "@/views/UMKM/UMKMKontak.vue";
import ConfirmationUmkm from "@/views/UMKM/UMKMConfirm.vue";
import AddProduk from "@/views/UMKM/ProdukAdd.vue";
import ProdukImage from "@/views/UMKM/ProdukImage.vue";
import ProdukConfirm from "@/views/UMKM/ProdukConfirm.vue";
import UMKMEdit from "@/views/UMKM/UMKMEdit.vue";
import UMKMEditPemilik from "@/views/UMKM/UMKMEditPemilik.vue";
import UMKMEditKoordinat from "@/views/UMKM/UMKMEditKoordinat.vue";
import UMKMditImage from "@/views/UMKM/UMKMEditImage.vue";
import UMKMEditKontak from "@/views/UMKM/UMKMEditKontak.vue";
import UMKMEditConfirm from "@/views/UMKM/UMKMEditConfirm.vue";
import ProdukEdit from "@/views/UMKM/ProdukEdit.vue";
import ProdukEditImage from "@/views/UMKM/ProdukEditImage.vue";
import ProdukEditConfirm from "@/views/UMKM/ProdukEditConfirm.vue"

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
    path: "/umkm/produk/:id",
    name: "produk-detail",
    component: ProdukDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/wilayah/:id",
    name: "aset-detail",
    component: AsetDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/wilayah/:id/penghuni",
    name: "penghuni-detail",
    component: PenghuniDetail,
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
    component: KoordinatUMKM,
  },
  {
    path: "/kontak",
    name: "kontak",
    component: KontakForm,
  },
  {
    path: "/confirmation",
    name: "confirmation",
    component: ConfirmationUmkm
  },
  {
    path: "/addproduk",
    name: "addproduk",
    component: AddProduk
  },
  {
    path: "/produkimage",
    name: "produkimage",
    component: ProdukImage
  },
  {
    path: "/produkconfirm",
    name: "produkconfirm",
    component: ProdukConfirm
  },
  {
    path: "/umkmedit/:id",
    name: "umkmedit",
    component: UMKMEdit
  },
  {
    path: "/umkmedit/:id/pemilik",
    name: "umkmeditpemilik",
    component: UMKMEditPemilik
  },
  {
    path: "/umkmedit/:id/koordinat",
    name: "umkmeditkoordinat",
    component: UMKMEditKoordinat
  },
  {
    path: "/umkmedit/:id/image",
    name: "umkmeditimage",
    component: UMKMditImage
  },
  {
    path: "/umkmedit/:id/kontak",
    name: "umkmeditkontak",
    component: UMKMEditKontak
  },
  {
    path: "/umkmedit/:id/confirmation",
    name: "umkmeditconfirmation",
    component: UMKMEditConfirm
  },
  {
    path: "/produkedit/:id",
    name: "produkedit",
    component: ProdukEdit
  },
  {
    path: "/produkedit/:id/image",
    name: "produkeditimage",
    component: ProdukEditImage
  },
  {
    path: "/produkedit/:id/confirmation",
    name: "produkeditconfirmation",
    component: ProdukEditConfirm
  }
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
