'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavbarConfig {
    overlay?: boolean;
    className?: string;
    hideOnScroll?: boolean;
}

interface NavbarConfigContextType {
    config: NavbarConfig;
    setConfig: (config: NavbarConfig) => void;
}

const NavbarConfigContext = createContext<NavbarConfigContextType>({
    config: {},
    setConfig: () => { },
});

export const useNavbarConfig = () => useContext(NavbarConfigContext);

export const NavbarConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<NavbarConfig>({});

    return (
        <NavbarConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </NavbarConfigContext.Provider>
    );
};

/**
 * Hook for Client Components to override Navbar configuration
 */
export const useSetNavbarConfig = (config: NavbarConfig) => {
    const { setConfig } = useNavbarConfig();
    const configKey = JSON.stringify(config);

    useEffect(() => {
        setConfig(config);
        return () => setConfig({});
    }, [configKey, setConfig]);
};

/**
 * Component to be used in Server Component pages as a bridge
 */
export const NavbarSettings = (props: NavbarConfig) => {
    useSetNavbarConfig(props);
    return null;
};

