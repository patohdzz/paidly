import { clients } from "../data/clients";
import { services } from "../data/services";
import { invoices } from "../data/invoices";

export const STORAGE_KEY = "paidly-data";

export const demoData = { clients, services, invoices };

export function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoData;
  } catch {
    return demoData;
  }
}

export function dataReducer(state, action) {
  const { collection } = action;

  switch (action.type) {
    case "ADD":
      return {
        ...state,
        [collection]: [...state[collection], action.item],
      };

    case "UPDATE":
      return {
        ...state,
        [collection]: state[collection].map((item) =>
          item.id === action.item.id ? action.item : item
        ),
      };

    case "DELETE":
      return {
        ...state,
        [collection]: state[collection].filter((item) => item.id !== action.id),
      };

    case "RESET":
      return demoData;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}