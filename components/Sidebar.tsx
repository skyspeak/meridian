import React from 'react'
import { XMarkIcon, HomeIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, CogIcon, Bars3Icon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  collapsed?: boolean
  setCollapsed?: (collapsed: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: DocumentTextIcon },
  { name: 'Test', href: '/test', icon: DocumentTextIcon },
  { name: 'Monitoring', href: '/monitoring', icon: ChatBubbleLeftRightIcon },
  { name: 'Users', href: '/users', icon: UserGroupIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function Sidebar({ open, setOpen, collapsed = false, setCollapsed }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  // Mobile sidebar (portal/modal pattern)
  return (
    <>
      {/* Mobile sidebar overlay/modal */}
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar */}
          <div className="relative flex w-64 flex-col bg-white shadow-xl z-50">
            <div className="flex h-16 items-center justify-between px-4">
              <h2 className="text-lg font-semibold text-gray-900">Meridian</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isCurrent = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                      isCurrent
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isCurrent ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 justify-between">
            {!collapsed && <h2 className="text-lg font-semibold text-gray-900">Meridian</h2>}
            {setCollapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            )}
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isCurrent = pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                    isCurrent
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 ${
                      isCurrent ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } ${collapsed ? 'h-6 w-6' : 'mr-3 h-6 w-6'}`}
                  />
                  {!collapsed && item.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
} 