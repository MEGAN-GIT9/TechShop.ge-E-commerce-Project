import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CATEGORY_GROUPS } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { useI18n } from '../context/I18nContext'
import LanguageSwitch from './LanguageSwitch'

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors hover:text-slate-900 ${isActive ? 'text-slate-900' : 'text-slate-600'}`

export default function Navbar() {
  const { t, lang } = useI18n()
  const { count } = useCart()
  const { user, isAuthenticated, signOut } = useAuth()
  const { search, setSearch, setGroup, setCategory } = useCatalog()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const categoriesRef = useRef(null)
  const accountRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) setCategoriesOpen(false)
      if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setCategoriesOpen(false)
    setAccountOpen(false)
  }, [location.pathname])

  const goToGroup = (key) => {
    setGroup(key)
    setCategoriesOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  const goToCategory = (key) => {
    setCategory(key)
    setCategoriesOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  const handleLogout = () => {
    signOut()
    setAccountOpen(false)
  }

  const categoriesDropdown = (
    <div
      ref={categoriesRef}
      className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50"
    >
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.key} className="px-2">
          <button
            type="button"
            onClick={() => goToGroup(group.key)}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-extrabold hover:bg-slate-50 flex items-center gap-2 text-slate-900"
          >
            <span className="text-base">{group.emoji}</span>
            <span>{group.label[lang]}</span>
          </button>
          {group.cats.map((catKey) => (
            <button
              key={catKey}
              type="button"
              onClick={() => goToCategory(catKey)}
              className="w-full text-left px-3 py-1.5 pl-9 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {catKey}
            </button>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <nav className="h-16 px-4 md:px-12 max-w-7xl mx-auto flex items-center gap-4">
        <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1 shrink-0">
          <span>TechShop</span>
          <span className="text-amber-500 animate-pulse">⚡</span>
        </Link>

        <div className="hidden lg:flex items-center gap-5 text-sm">
          <NavLink to="/" end className={navLinkClass}>
            {t('navHome')}
          </NavLink>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold text-slate-600"
            >
              {t('navCategories')} <span className="text-[9px] mt-0.5">▾</span>
            </button>
            {categoriesOpen && categoriesDropdown}
          </div>
          <NavLink to="/discounts" className="hover:text-rose-700 transition-colors flex items-center gap-1 font-semibold text-rose-600">
            {t('navDiscounts')}
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            {t('navAbout')}
          </NavLink>
        </div>

        <div className="flex-1 flex items-center gap-2 sm:gap-3 justify-end">
          <div className="relative hidden sm:block w-full max-w-[240px] lg:max-w-xs">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                if (!event.target.value && window.location.hash !== '#/') navigate('/')
              }}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>

          <LanguageSwitch />

          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap"
              >
                👤 <span className="hidden sm:inline max-w-[110px] truncate align-middle">{user.name}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('authSignedInAs')}
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email || user.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {t('navLogout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              🔑 <span className="hidden sm:inline">{t('navLogin')}</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            <span>🛒 <span className="hidden sm:inline">{t('navCart')}</span></span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center border-2 border-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t('openMenu')}
            aria-expanded={menuOpen}
            className="lg:hidden text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="relative sm:hidden">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="w-full pl-4 pr-3 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
            <Link to="/" className="py-2 hover:text-slate-900">
              {t('navHome')}
            </Link>
            <Link to="/discounts" className="py-2 text-rose-600">
              {t('navDiscounts')}
            </Link>
            <Link to="/about" className="py-2 hover:text-slate-900">
              {t('navAbout')}
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t('navCategories')}</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_GROUPS.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => goToGroup(group.key)}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="mr-1">{group.emoji}</span>
                  {group.label[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}