import { createContext, useState } from "react";
const ContextApi = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  return (
    <ContextApi.Provider value={{ user, setUser }}>
      {children}
    </ContextApi.Provider>
  );
};

export { ContextApi, ContextProvider };
