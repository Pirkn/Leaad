import { createContext, useContext, useState } from "react";

const LeadsContext = createContext({
  newlyGeneratedLeads: [],
  addNewlyGeneratedLeads: () => {},
  clearNewlyGeneratedLeads: () => {},
});

export const useLeadsContext = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeadsContext must be used within a LeadsProvider");
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const [newlyGeneratedLeads, setNewlyGeneratedLeads] = useState([]);

  const addNewlyGeneratedLeads = (leads) => {
    console.log("Adding newly generated leads:", leads);
    setNewlyGeneratedLeads((prev) => [...leads, ...prev]);
  };

  const clearNewlyGeneratedLeads = () => {
    setNewlyGeneratedLeads([]);
  };

  return (
    <LeadsContext.Provider
      value={{
        newlyGeneratedLeads,
        addNewlyGeneratedLeads,
        clearNewlyGeneratedLeads,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};
