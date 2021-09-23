import UserMenu from './UserMenu'
import AppLogo from 'components/AppLogo'

const Menu: React.FC = ({ children }) => {
  return (
    <>
      <nav className="py-2 navbar shadow-medium">
        <div className="container flex items-center">
          <a href="/">
            <img className="logo" src="/images/logo.svg" />
          </a>
          <UserMenu className="ml-auto" />
        </div>
      </nav>
      <main>{children}</main>
    </>
  )
}

export default Menu
