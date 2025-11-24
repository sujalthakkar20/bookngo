import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

const OFFER_CARDS = [
  { title: "Save up to ₹300 on bus tickets", code: "FESTIVAL300", valid: "Valid till 06 Oct", color: "#FFF7E6" },
  { title: "Save up to ₹500 on bus tickets", code: "RED500", valid: "Valid till 30 Sep", color: "#E8F8F5" },
  { title: "Save up to ₹250 on bus tickets", code: "FIRST", valid: "Valid till 30 Sep", color: "#F3F6FF" },
  { title: "Save upto ₹500 with Axis Credit Cards", code: "AXIS300", valid: "Valid till 09 Oct", color: "#FFF0F6" },
];

const WHATS_NEW = [
  { title: "Free Cancellation", desc: "Get 100% refund on cancellation." },
  { title: "Bus Timetable", desc: "Check bus timings between cities." },
  { title: "FlexiTicket", desc: "Benefits on date change & cancellation." },
  { title: "Assurance Program", desc: "Insure your trip against cancellations & accidents." },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm BookNGo Assistant 🤖 — Ask about bookings, offers." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const pushMessage = (msg) => setMessages((m) => [...m, msg]);

  const formatId = (id) => id?.toUpperCase();

  // BOT LOGIC
  const botEngine = (msg) => {
    const text = msg.toLowerCase();
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    if (/^(hi|hello|hey)/i.test(text))
      return { text: "Hello! I can show bookings, offers on ticket. What do you want?" };

    if (text.includes("offer")) return { text: "Here are today's offers:", offers: OFFER_CARDS };
    if (text.includes("what") && text.includes("new")) return { text: "What's new:", whatsnew: WHATS_NEW };

    if (text.includes("my booking") || text.includes("show booking") || text.includes("tickets")) {
      if (!bookings.length) return { text: "You have no bookings right now." };

      return {
        text: bookings
          .map(
            (b) =>
              `${formatId(b._id)} • ${b.bus?.from}→${b.bus?.to} • ₹${b.totalPrice} • ${b.status}`
          )
          .join("\n\n"),
      };
    }

    // Ticket details
    const idMatch = text.match(/tck-[a-z0-9]+/);
    if (idMatch && !text.includes("cancel")) {
      const t = idMatch[0];
      const found = bookings.find((b) => b._id.toLowerCase() === t);
      if (!found) return { text: `No ticket found for ${t.toUpperCase()}` };

      return {
        text: `Ticket ${formatId(found._id)}
Bus: ${found.bus?.busName}
Route: ${found.bus?.from} → ${found.bus?.to}
Date: ${new Date(found.travelDate).toLocaleDateString()}
Seats: ${found.seatsBooked.join(", ")}
Amount: ₹${found.totalPrice}
Status: ${found.status}`,
      };
    }

    // Cancel ticket
    if (text.includes("cancel")) {
      if (!idMatch) return { text: "Please specify a valid Ticket ID. Example: cancel TCK-9FCA12" };

      const t = idMatch[0];
      let updated = false;

      const newBookings = bookings.map((b) => {
        if (b._id.toLowerCase() === t) {
          updated = true;
          return { ...b, status: "cancelled" };
        }
        return b;
      });

      if (!updated) return { text: `No booking found for ${t.toUpperCase()}` };

      localStorage.setItem("bookings", JSON.stringify(newBookings));
      window.dispatchEvent(new Event("bookingsUpdated"));

      return { text: `✔ Ticket ${t.toUpperCase()} cancelled successfully.` };
    }

    return { text: "I can show bookings, offers, what's new or cancel ticket. Try: Show my bookings" };
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = input.trim();
    pushMessage({ sender: "user", text: msg });
    setInput("");

    setTimeout(() => {
      const reply = botEngine(msg);
      pushMessage({ sender: "bot", ...reply });
    }, 400);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        🤖
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-left">
              <img src="/logo192.png" alt="bot" className="bot-avatar" />
              <div>
                <div className="bot-title">BookNGo Assistant</div>
                <div className="bot-sub">AI Support</div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.sender}`}>
                  <div className="bubble">
                    {m.text?.split("\n").map((l, i) => <p key={i}>{l}</p>)}

                    {m.offers && (
                      <div className="card-row">
                        {m.offers.map((o, i) => (
                          <div key={i} className="offer-card" style={{ background: o.color }}>
                            <div className="offer-title">{o.title}</div>
                            <div className="offer-code">{o.code}</div>
                            <div className="offer-valid">{o.valid}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.whatsnew && (
                      <div className="card-row">
                        {m.whatsnew.map((w, i) => (
                          <div key={i} className="whats-card">
                            <div className="wn-title">{w.title}</div>
                            <div className="wn-desc">{w.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input">
              <input
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
