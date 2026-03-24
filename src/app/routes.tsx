import { createBrowserRouter, Navigate } from "react-router-dom";
import { CatchAllNavigate } from "./guards/CatchAllNavigate";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireRole } from "./guards/RequireRole";
import { RedirectToOperacionExpediente } from "./redirects/ProviderLegacyRedirects";
import { AppShell } from "./layout/AppShell";
import { AuthShell } from "./layout/AuthShell";
import { ProviderShell } from "./layout/ProviderShell";
import { PublicLayout } from "./layout/PublicLayout";
import { RegistrationLayout } from "./layout/RegistrationLayout";
import {
  AdminBibliotecaPage,
  CatalogsPage,
  ContractsPage,
  DashboardPage,
  EvaluationCapturePage,
  EvaluationConfigPage,
  ExpedientePage,
  ForgotPasswordPage,
  InternalPlanDetailPage,
  InternalPlanesMejoraPage,
  InternalProveedorExpedientePage,
  LandingPage,
  LoginPage,
  NoAccessPage,
  PeriodsPage,
  ProviderBibliotecaPage,
  ProviderContractsPage,
  ProviderDocsPage,
  ProviderEvaluationDetailPage,
  ProviderEvaluationPage,
  ProviderExpedienteHubPage,
  ProviderExpedientePage,
  ProviderFacturacionPage,
  ProviderHomePage,
  ProviderPlanDetailPage,
  ProviderPlanesPage,
  ProviderPeriodsPage,
  ProviderDetailPage,
  ProvidersPage,
  RankingPage,
  RegisterClasificacionPage,
  RegisterConfirmacionPage,
  RegisterCuestionarioPage,
  RegisterDataPage,
  RegisterDocumentosPage,
  RegisterSeguimientoPage,
  ReportsPage,
  UsersPage,
  ValidationPage,
} from "../features/pages";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  {
    element: <AuthShell />,
    children: [
      { path: "/login/proveedor", element: <LoginPage audience="proveedor" /> },
      { path: "/login/empresa", element: <LoginPage audience="empresa" /> },
      { path: "/recuperar-contrasena", element: <ForgotPasswordPage /> },
    ],
  },
  { path: "/login", element: <Navigate to="/" replace /> },
  { path: "/forgot-password", element: <Navigate to="/recuperar-contrasena" replace /> },
  {
    path: "/registro",
    element: <RegistrationLayout />,
    children: [
      { index: true, element: <Navigate to="datos" replace /> },
      { path: "datos", element: <RegisterDataPage /> },
      { path: "clasificacion", element: <RegisterClasificacionPage /> },
      { path: "cuestionario", element: <RegisterCuestionarioPage /> },
      { path: "documentos", element: <RegisterDocumentosPage /> },
      { path: "confirmacion", element: <RegisterConfirmacionPage /> },
    ],
  },
  { path: "/registro/seguimiento/:id", element: <RegisterSeguimientoPage /> },
  { path: "/sin-acceso", element: <NoAccessPage /> },
  {
    element: <RequireAuth redirectTo="/login/empresa" />,
    children: [
      {
        path: "/app",
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "proveedores", element: <ProvidersPage /> },
          { path: "proveedores/:id", element: <ProviderDetailPage /> },
          { path: "proveedores/:id/expediente", element: <InternalProveedorExpedientePage /> },
          { path: "proveedores/:id/contratos", element: <ContractsPage /> },
          { path: "contratos/:id/periodos", element: <PeriodsPage /> },
          { path: "expediente/:proveedorId/:contratoId/:periodoId", element: <ExpedientePage /> },
          { path: "catalogos", element: <Navigate to="/app/config/documentos" replace /> },
          { path: "usuarios", element: <Navigate to="/app/admin/usuarios" replace /> },
          {
            element: <RequireRole roles={["VR", "AP", "AC", "CO"]} />,
            children: [
              { path: "validacion", element: <ValidationPage /> },
              { path: "evaluacion", element: <EvaluationConfigPage /> },
              { path: "evaluacion/:proveedorId", element: <EvaluationCapturePage /> },
              { path: "ranking", element: <RankingPage /> },
              { path: "planes-mejora", element: <InternalPlanesMejoraPage /> },
              { path: "planes-mejora/:id", element: <InternalPlanDetailPage /> },
            ],
          },
          {
            element: <RequireRole roles={["AP", "AC", "CO"]} />,
            children: [
              { path: "reportes", element: <ReportsPage /> },
              { path: "config/documentos", element: <CatalogsPage /> },
            ],
          },
          {
            element: <RequireRole roles={["AP", "AC"]} />,
            children: [
              { path: "admin/usuarios", element: <UsersPage /> },
              { path: "admin/biblioteca", element: <AdminBibliotecaPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <RequireAuth redirectTo="/login/proveedor" />,
    children: [
      {
        path: "/proveedor",
        element: <ProviderShell />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <ProviderHomePage /> },
          { path: "expediente", element: <ProviderExpedienteHubPage /> },
          { path: "documentos", element: <ProviderDocsPage /> },
          { path: "evaluacion", element: <ProviderEvaluationPage /> },
          { path: "evaluacion/detalle", element: <ProviderEvaluationDetailPage /> },
          { path: "planes", element: <ProviderPlanesPage /> },
          { path: "planes/:id", element: <ProviderPlanDetailPage /> },
          { path: "biblioteca", element: <ProviderBibliotecaPage /> },
          { path: "facturacion", element: <ProviderFacturacionPage /> },
          { path: "operacion/contratos", element: <ProviderContractsPage /> },
          { path: "operacion/periodos", element: <ProviderPeriodsPage /> },
          { path: "operacion/expediente/:periodoId", element: <ProviderExpedientePage /> },
          { path: "contratos", element: <Navigate to="/proveedor/operacion/contratos" replace /> },
          { path: "periodos", element: <Navigate to="/proveedor/operacion/periodos" replace /> },
          { path: "expediente/:periodoId", element: <RedirectToOperacionExpediente /> },
        ],
      },
    ],
  },
  { path: "*", element: <CatchAllNavigate /> },
]);
