import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [langIsGerman, setLangIsGerman] = useState(true);

  return (
    <AppContext.Provider
      value={{
        langIsGerman,
        setLangIsGerman,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
