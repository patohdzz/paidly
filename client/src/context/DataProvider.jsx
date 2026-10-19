import { useEffect, useReducer } from "react";
import { DataContext } from "./DataContext";
import { STORAGE_KEY, dataReducer, loadInitialData } from "./dataStore";

function DataProvider({ children }) {
  const [data, dispatch] = useReducer(dataReducer, undefined, loadInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return (
    <DataContext.Provider value={{ ...data, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;