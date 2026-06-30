import type { ComponentType } from 'react'

// Props every prototype receives: the current theme state plus a toggle.
// Kept here so the prototype stays portable across sandboxes.
export type PrototypeProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export type PrototypeComponent = ComponentType<PrototypeProps>
