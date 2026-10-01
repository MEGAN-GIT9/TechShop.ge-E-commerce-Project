import { useI18n } from '../context/I18nContext'
import { useUi } from '../context/UiContext'

export default function Footer() {
  const { t } = useI18n()
  const { openPolicy } = useUi()

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto px-4 md:px-12 pt-10 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-100 pb-8">
        <div>
          <h4 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-wider">TechShop ⚡</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{t('footerAbout')}</p>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-wider">{t('footerCustomerTitle')}</h4>
          <div className="flex flex-col gap-2 text-xs font-bold text-slate-500">
            <button type="button" onClick={() => openPolicy('terms')} className="text-left hover:text-slate-900 transition-colors">
              {t('footerTerms')}
            </button>
            <button type="button" onClick={() => openPolicy('warranty')} className="text-left hover:text-slate-900 transition-colors">
              {t('footerWarranty')}
            </button>
            <button type="button" onClick={() => openPolicy('return')} className="text-left hover:text-slate-900 transition-colors">
              {t('footerReturn')}
            </button>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-wider">{t('footerServicesTitle')}</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            <span className="text-slate-700 font-bold">{t('footerDeliveryLabel')}</span> {t('footerDeliveryText')}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{t('footerInstallmentLabel')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} TechShop Electronics. {t('footerRights')}
        </p>
        <p className="text-xs font-medium text-slate-300">{t('footerBuiltWith')}</p>
      </div>
    </footer>
  )
}