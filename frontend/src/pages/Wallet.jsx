import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "../pages/WalletContext";
import { useAuth } from "../context/AuthContext";
import "./Wallet.css";

const Wallet = () => {
  const { walletBalance, transactions, loading } = useWallet();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="wallet-container">
        <div className="wallet-card">
          <h2>Please Login</h2>
          <p className="empty-text">You must be logged in to view your wallet.</p>
          <button className="primary-btn full-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="wallet-container">Loading wallet...</div>;

  return (
    <div className="wallet-container">
      <h2 className="wallet-title">My Wallet</h2>

      <div className="wallet-card balance-card">
        <h3>Available Balance</h3>
        <p className="wallet-amount">₹{walletBalance}</p>
        <Link to="/add-money" className="primary-btn full-btn">
          Add Money
        </Link>
      </div>

      <h3 className="section-title">Transaction History</h3>
      <div className="wallet-card transactions-card">
        {transactions.length === 0 ? (
          <p className="empty-text">No transactions yet.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((tx, index) => (
              <li key={index} className="transaction-item">
                <div>
                  <span className={`tx-type ${tx.type === "Add" ? "add" : "deduct"}`}>
                    {tx.type}
                  </span>
                  <span className="tx-date">{new Date(tx.date).toLocaleString()}</span>
                </div>
                <strong className="tx-amount">₹{tx.amount}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Wallet;
