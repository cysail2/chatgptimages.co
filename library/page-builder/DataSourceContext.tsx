
import React, { createContext, useContext } from 'react';

export const DataSourceContext = createContext<Record<string, any>>({});

export const useDataSource = () => useContext(DataSourceContext);

export const DataSourceProvider: React.FC<{ children: React.ReactNode; dataSources: Record<string, any> }> = ({
    children,
    dataSources,
}) => {
    return (
        <DataSourceContext.Provider value={dataSources}>
            {children}
        </DataSourceContext.Provider>
    );
};
