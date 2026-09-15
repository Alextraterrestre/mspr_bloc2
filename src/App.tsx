import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { DemoProvider } from './Contexts/DemoContext'
import { AppShell } from './Components/AppShell'
import { CreateAccount } from './Pages/CreateAcount'
import { SetupTotp } from './Pages/SetUpTOTP'
import { Login } from './Pages/Login'
import { RenewAccount } from './Pages/RenewAccount'
import { StyleGuide } from './Pages/StyleGuide'
import { flowSteps } from './Data/Steps'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={flowSteps[0].path} replace /> },
      { path: '/creation-compte', element: <CreateAccount /> },
      { path: '/configuration-2fa', element: <SetupTotp /> },
      { path: '/connexion', element: <Login /> },
      { path: '/renouvellement', element: <RenewAccount /> },
      { path: '/style-guide', element: <StyleGuide /> },
      { path: '*', element: <Navigate to={flowSteps[0].path} replace /> },
    ],
  },
])

export default function App() {
  return (
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>
  )
}
