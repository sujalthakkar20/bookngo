import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadWallet();
    } else {
      setWalletBalance(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/wallet");
      setWalletBalance(data.walletBalance);
      setTransactions(data.transactions);
    } catch (err) {
      console.error("Error loading wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMoney = async (amount) => {
    try {
      await API.post("/wallet/add", { amount });
      await loadWallet(); // refresh wallet after adding money
    } catch (err) {
      console.error("Failed to add money:", err);
      throw err;
    }
  };

  const deductFromWallet = async (amount) => {
    try {
      await API.post("/wallet/deduct", { amount });
      await loadWallet(); // refresh wallet after deduction
    } catch (err) {
      console.error("Failed to deduct money:", err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletBalance,
        transactions,
        loading,
        addMoney,
        deductFromWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
