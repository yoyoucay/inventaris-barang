// components/Sidebar.tsx

import { MenuList } from "./Menu";

interface SidebarProps {
    isSidebarOpen: boolean;
    isHovered?: boolean;
}

export default function Sidebar({ isSidebarOpen, isHovered }: SidebarProps) {
    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          ${isSidebarOpen
                    ? "w-[290px]"
                    : "w-[90px]"
                }
          "-translate-x-full"
          lg:translate-x-0`}
        >
            <div
                className={`py-8 flex "justify-start"
                    }`}
            >
                {isSidebarOpen ? (
                    <h1 className="text-xl font-bold text-blue-600">Invent</h1>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isSidebarOpen
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    }`}
                            >
                                {isSidebarOpen ? (
                                    "Menu"
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <i className="bx bx-dots-horizontal-rounded bx-sm" />
                                    </span>
                                )}
                            </h2>
                        </div>
                        <MenuList isSidebarOpen={isSidebarOpen} />
                    </div>
                </nav>
            </div>
        </aside>
    );
}