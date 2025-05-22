import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

import LoginPage from "@/views/Auth/LoginPage.vue";
import RegisterPage from "@/views/Auth/RegisterPage.vue";
import RegistrationFormPage from "@/views/Auth/RegistrationFormPage.vue";

import HomePage from "@/views/Home/HomePage.vue";
import DashboardUMKM from "@/views/UMKM/DashboardUMKM.vue";
import DashboardWilayah from "@/views/Wilayah/DashboardWilayah.vue";

import UMKMDetail from "@/views/UMKM/UMKMDetail.vue";
import UMKMAdd from "@/views/UMKM/UMKMAdd.vue";
import UMKMPemilik from "@/views/UMKM/UMKMPemilik.vue";
import UMKMKoordinat from "@/views/UMKM/UMKMKoordinat.vue";
import UMKMImage from "@/views/UMKM/UMKMImage.vue";
import UMKMKontak from "@/views/UMKM/UMKMKontak.vue";
import UMKMConfirm from "@/views/UMKM/UMKMConfirm.vue";
import UMKMEdit from "@/views/UMKM/UMKMEdit.vue";
import UMKMEditPemilik from "@/views/UMKM/UMKMEditPemilik.vue";
import UMKMEditKoordinat from "@/views/UMKM/UMKMEditKoordinat.vue";
import UMKMEditImage from "@/views/UMKM/UMKMEditImage.vue";
import UMKMEditKontak from "@/views/UMKM/UMKMEditKontak.vue";
import UMKMEditConfirm from "@/views/UMKM/UMKMEditConfirm.vue";

import ProdukDetail from "@/views/UMKM/ProdukDetail.vue";
import ProdukAdd from "@/views/UMKM/ProdukAdd.vue";
import ProdukImage from "@/views/UMKM/ProdukImage.vue";
import ProdukConfirm from "@/views/UMKM/ProdukConfirm.vue";
import ProdukEdit from "@/views/UMKM/ProdukEdit.vue";
import ProdukEditImage from "@/views/UMKM/ProdukEditImage.vue";
import ProdukEditConfirm from "@/views/UMKM/ProdukEditConfirm.vue"

import AsetDetail from "@/views/Wilayah/AsetDetail.vue";
import PenghuniDetail from "@/views/Wilayah/PenghuniDetail.vue";
import AsetAdd from "@/views/Wilayah/AsetAdd.vue"
import AsetPemilik from "@/views/Wilayah/AsetPemilik.vue"
import AsetImage from "@/views/Wilayah/AsetImage.vue"
import AsetConfirm from "@/views/Wilayah/AsetConfirm.vue"
import AsetEdit from "@/views/Wilayah/AsetEdit.vue"
import AsetEditPemilik from "@/views/Wilayah/AsetEditPemilik.vue"
import AsetEditImage from "@/views/Wilayah/AsetEditImage.vue"
import AsetEditConfirm from "@/views/Wilayah/AsetEditConfirm.vue"
import AsetKoordinat from "@/views/Wilayah/AsetKoordinat.vue"
import PenghuniSettings from "@/views/Wilayah/PenghuniSettings.vue";
import PenghuniAdd from "@/views/Wilayah/PenghuniAdd.vue";

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
    path: "/addumkm",
    name: "addumkm",
    component: UMKMAdd,
  },
  {
    path: "/pemilik",
    name: "pemilik",
    component: UMKMPemilik,
  },
  {
    path: "/koordinatumkm",
    name: "koordinatumkm",
    component: UMKMKoordinat,
  },
  {
    path: "/uploadView",
    name: "uploadView",
    component: UMKMImage,
  },
  {
    path: "/kontak",
    name: "kontak",
    component: UMKMKontak,
  },
  {
    path: "/confirmation",
    name: "confirmation",
    component: UMKMConfirm
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
    component: UMKMEditImage
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
    path: "/umkm/produk/:id",
    name: "produk-detail",
    component: ProdukDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/addproduk",
    name: "addproduk",
    component: ProdukAdd
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
    path: "/asetadd",
    name: "asetadd",
    component: AsetAdd
  },
  {
    path: "/asetpemilik",
    name: "asetpemilik",
    component: AsetPemilik
  },
  {
    path: "/asetimage",
    name: "asetimage",
    component: AsetImage
  },
  {
    path: "/asetconfirm",
    name: "asetconfirm",
    component: AsetConfirm
  },
  {
    path: "/asetedit/:id",
    name: "asetedit",
    component: AsetEdit
  },
  {
    path: "/asetedit/:id/pemilik",
    name: "aseteditpemilik",
    component: AsetEditPemilik
  },
  {
    path: "/asetedit/:id/image",
    name: "aseteditimage",
    component: AsetEditImage
  },
  {
    path: "/asetedit/:id/confirmation",
    name: "aseteditconfirmation",
    component: AsetEditConfirm
  },
  {
    path: "/asetkoordinat/:id",
    name: "asetkoordinat",
    component: AsetKoordinat
  },
  {
    path: "/penghunisettings/:id",
    name: "penghunisettings",
    component: PenghuniSettings
  },
  {
    path: "/penghuniadd/:id",
    name: "penghuniadd",
    component: PenghuniAdd
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
