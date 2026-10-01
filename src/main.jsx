import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { I18nProvider } from './context/I18nContext'
import { ToastProvider } from './context/ToastContext'
import { UiProvider } from './context/UiContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <CatalogProvider>
            <CartProvider>
              <UiProvider>
                {/* HashRouter keeps the SPA working on GitHub Pages and static hosts */}
                <HashRouter>
                  <App />
                </HashRouter>
              </UiProvider>
            </CartProvider>
          </CatalogProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  </StrictMode>,
)