import "./Header.css";

function Header() {
  return (
    <div className="header">
      <div>
        <h1>Event types</h1>
        <p>Configure different events for people to book on your calendar.</p>
      </div>

      <div className="actions">
        <input placeholder="Search" />
        <button>+ New</button>
      </div>
    </div>
  );
}

export default Header;