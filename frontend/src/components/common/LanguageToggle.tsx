import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  language: 'EN' | 'MY'
  setLanguage: (lang: 'EN' | 'MY') => void
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'EN',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
)

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-1 items-center border rounded-lg p-1 bg-gray-50 dark:bg-gray-800">
      <button
        onClick={() => setLanguage('EN')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          language === 'EN'
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('MY')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          language === 'MY'
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        BM
      </button>
    </div>
  )
}
