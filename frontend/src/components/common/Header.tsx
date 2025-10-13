import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Input,
} from '@nextui-org/react'
import { FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { googleLogin } from '../../services/api'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
  ]

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white dark:bg-gray-800"
      maxWidth="xl"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link to="/" className="font-bold text-xl text-primary-600">
            Qalam Al-Ilm
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        <NavbarBrand>
          <Link to="/" className="font-bold text-2xl text-primary-600">
            Qalam Al-Ilm
          </Link>
        </NavbarBrand>
        {menuItems.map((item) => (
          <NavbarItem key={item.path}>
            <Link
              to={item.path}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem className="hidden lg:flex">
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<FiSearch className="text-gray-400" />}
              className="w-64"
              size="sm"
            />
          </form>
        </NavbarItem>

        <NavbarItem>
          <LanguageToggle />
        </NavbarItem>

        <NavbarItem>
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user.name}
                  size="sm"
                  src={user.profilePicture}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  startContent={<FiSettings />}
                  onClick={() => navigate('/admin')}
                >
                  {user.role.name === 'Admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </DropdownItem>
                <DropdownItem
                  key="profile-settings"
                  startContent={<FiUser />}
                  onClick={() => navigate('/profile')}
                >
                  Profile Settings
                </DropdownItem>
                <DropdownItem key="logout" color="danger" startContent={<FiLogOut />} onClick={logout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button color="primary" variant="flat" onClick={() => navigate('/login')} size="sm">
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.path}-${index}`}>
            <Link
              to={item.path}
              className="w-full text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <form onSubmit={handleSearch} className="w-full mt-4">
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<FiSearch className="text-gray-400" />}
              fullWidth
            />
          </form>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}
