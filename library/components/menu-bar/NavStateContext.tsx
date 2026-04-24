'use client';

import React, { createContext, useContext } from 'react';

interface NavState {
    isScrolled: boolean;
    isOverlay: boolean;
}

const NavStateContext = createContext<NavState>({
    isScrolled: false,
    isOverlay: false,
});

export const useNavState = () => useContext(NavStateContext);

export const NavStateProvider = ({
    children,
    value
}: {
    children: React.ReactNode;
    value: NavState
}) => {
    return (
        <NavStateContext.Provider value={value}>
            {children}
        </NavStateContext.Provider>
    );
};
