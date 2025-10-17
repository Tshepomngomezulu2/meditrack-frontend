import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">MediTrack PIMS</h1>
        <p className="home-subtitle">Professional Hospital Staff Portal</p>
        <div className="home-actions">
          <Link to="/login">
            <button className="home-btn login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="home-btn signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
