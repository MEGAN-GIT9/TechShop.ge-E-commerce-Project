import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import Footer from './Footer'
import Navbar from './Navbar'
import PolicyModal from './PolicyModal'
import ToastViewport from './ToastViewport'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <PolicyModal />
      <ToastViewport />
    </div>
  )
}