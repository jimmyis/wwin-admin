import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Winwinwin Project | Sacred Non-Fungible Token',
  description: '',
  image: `${window.location.origin}/hero.jpg`,
}

export const getCustomMeta = (path: string): PageMeta | null => {
  switch (path) {
    case '/mint':
      return {
        title: `${DEFAULT_META.title} - Mint`,
        description: DEFAULT_META.description,
      }
    case '/redeem':
      return {
        title: `${DEFAULT_META.title} - Redeem`,
        description: DEFAULT_META.description,
      }
    default:
      return null
  }
}
