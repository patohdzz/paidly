import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used inside a DataProvider");
  }

  return context;
}