"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  BoxIcon,
  UserIcon,
  DocsIcon,
  PageIcon,
  ShootingStarIcon,
  TaskIcon,
  PieChartIcon,
  ChatIcon,
} from "../icons/index";
import { useLocale } from '@/context/LocaleContext';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const getNavItems = (messages: any): NavItem[] => [
  {
    icon: <GridIcon />,
    name: messages["nav_dashboard"] || "Dashboard",
    path: "/",
  },
   {
    icon: <BoxIcon />,
    name: messages["nav_products"] || "Products",
    subItems: [
      { name: messages["nav_product_categories"] || "Product Categories", path: "/products/product-categories" },
      { name: messages["nav_original_product"] || "Products", path: "/products/original-products" },
    ],
  },
    {
    icon: <TaskIcon />,
    name: messages["nav_services"] || "Services",
    path: "/services",
  },
  {
    icon: <PieChartIcon />,
    name: messages["nav_projects"] || "Projects",
    path: "/projects",
  },
  
];

const getOtherItems = (messages: any): NavItem[] => [
   {
    icon: <UserIcon />,
    name: messages["nav_users"] || "Users",
    path: "/users/original-users",
  },
  {
    icon: <UserCircleIcon />,
    name: messages["nav_profile"] || "User Profile",
    path: "/profile",
  },
   {
    icon: <ChatIcon />,
    name: messages["nav_communication_requests"] || "Communication Requests",
    path: "/communication-requests",
  },
   {
    icon: <PageIcon />,
    name: messages["nav_blog"] || "Blog",
    path: "/blog",
  },
   {
    icon: <GridIcon />,
    name: messages["nav_setting"] || "Settings",
    subItems: [
      { name: messages["nav_about_us"] || "About Us ", path: "/setting/about-us" },
      { name: messages["nav_co_information"] || "Contact Information", path: "/setting/co-information" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { locale, messages } = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const navItems = getNavItems(messages);
  const othersItems = getOtherItems(messages);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`
    fixed flex flex-col px-5
    ${dir === 'ltr' ? 'left-0' : 'right-0 left-auto'}
    bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900
    transition-all duration-300 ease-in-out z-50 border-r border-gray-200
    ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
    ${isMobileOpen
          ? "translate-x-0"
          : dir === "rtl"
            ? "translate-x-full"
            : "-translate-x-full"
        }
    lg:translate-x-0

    // position top
    top-16 lg:top-0

    // height
    h-[calc(100vh-64px)] lg:h-screen
  `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                // src="/images/logo/b-main-logo-removebg.png"
                src="/images/logo/light-theme-logo.png"
                alt="Logo"
                width={200}
                height={30}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/dark-theme-logo.png"
                alt="Logo"
                width={200}
                height={30}
              />
            </>
          ) : (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/main-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/main-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
            </>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? messages["nav_menu"] || "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? messages["nav_others"] || "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>

  );
};

export default AppSidebar;
