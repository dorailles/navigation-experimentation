import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { light, dark } from '@instructure/ui-themes'
import NavigationExperimentation from './navigation-experimentation'

// Standalone host for the Navigation Experimentation prototype.
// Manages light/dark theme state and hands the prototype its toggle.
function App() {
  const [isDark, setIsDark] = useState(false)
  return (
    <InstUISettingsProvider theme={isDark ? dark : light}>
      <NavigationExperimentation
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
      />
    </InstUISettingsProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
