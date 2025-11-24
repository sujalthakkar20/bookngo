import React, { useState } from "react";
import { useWallet } from "../pages/WalletContext";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";

const AddMoney = () => {
  const { addMoney } = useWallet();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const value = Number(amount);
    if (value <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await addMoney(value); // reload wallet after adding money
      alert(`₹${value} added successfully!`);
      setAmount("");
      navigate("/wallet"); // redirect to wallet
    } catch (err) {
      alert("Failed to add money. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-container">
      <div className="wallet-card add-card">
        <h2>Add Money</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="wallet-input"
          min="1"
          step="1"
        />
        <button
          onClick={handleAdd}
          className="primary-btn full-btn"
          disabled={loading || !amount}
        >
          {loading ? "Processing..." : "Add to Wallet"}
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
