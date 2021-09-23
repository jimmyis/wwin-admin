import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { DEFAULT_META, getCustomMeta } from 'configs/constants/meta'
import Menu from 'components/Menu'

const PageMeta = () => {
  const { pathname } = useLocation()

  const pageMeta = getCustomMeta(pathname) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  const pageTitle = title

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

const DefaultLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <Menu>
      <PageMeta />
      <div {...props}>{children}</div>
    </Menu>
  )
}

export default DefaultLayout
