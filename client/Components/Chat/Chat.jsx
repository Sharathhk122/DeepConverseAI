// Chat.jsx (no changes needed)
import React, { useState, useEffect } from "react";
import { BiMenu } from "react-icons/bi";
import { MdPaid } from "react-icons/md";
import Form from "./Form";
import { useStateContext } from "../../Context/index";

const Chat = () => {
  const [active, setActive] = useState("Ask anything");
  const [hide, setHide] = useState(true);
  const { Free, address } = useStateContext();
  const [proMember, setProMember] = useState({});
  const [freeTrail, setFreeTrail] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const UserDetail = localStorage.getItem("UserDetail");
    const member = JSON.parse(UserDetail);
    setProMember(member);

    const freeTrail = localStorage.getItem("freeTrail");
    setFreeTrail(freeTrail);
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [active]);

  const display = Free?.replace(/['"]+/g, "");

  const close = (e) => {
    e.preventDefault();
    setHide(false);
  };

  const productList = [
    "Ask anything",
    "Content Writer",
    "Code Generator",
    "Translate anything",
    "Social media",
    "Email Generator",
    "Personal Advise",
    "Password Generator",
    "Travel/Hangout",
    "Essay Writer",
  ];

  return (
    <div
      className="tab-pane fade show active"
      id="chat"
      role="tabpanel"
      aria-labelledby="chat"
      tabIndex="0"
    >
      <div className="main-wrapper">
        <nav className="navbar navbar-expand-lg bg-light p-0">
          <button
            className="navbar-toggler d-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <BiMenu className="mobil_custom_menu" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="inner-menu-panel">
              <button
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                className="inner-close d-block d-lg-none"
              >
                Back
              </button>
              <div className="search-box">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search here..."
                />
              </div>
              <ul className="inner-links-list" id="innerLink">
                {productList.map((product, i) => (
                  <li
                    key={i + 1}
                    onClick={() => setActive(product)}
                    className={product === active ? "active" : ""}
                  >
                    <a href="#!">{product}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="chat-header">
          <div className="d-flex align-items-center gap-2">
            <h3 style={{
              backgroundColor: "#2c2c2e",
              padding: "10px 15px",
              borderRadius: "10px",
              color: "#FFFFFF",
              margin: 0
            }}>{active}</h3>
          </div>
          <div className="header-option">
            {display === "Pro Member" ? (
              <a href="#">{display}</a>
            ) : (
              <a className="del-btn" data-cursor="pointer" href="">
                Free Left (<span id="freeTry">{Free || 0}</span> / 100 )
              </a>
            )}
            <a
              className="premium-btn"
              id="subscriptionBtn"
              data-cursor="pointer"
              href="#!"
            >
              <MdPaid /> Get
              <span>premium</span>
            </a>
          </div>
        </div>
        <div className="main-chat">
          <Form
            close={close}
            proMember={proMember}
            address={address}
            freeTrail={freeTrail}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;