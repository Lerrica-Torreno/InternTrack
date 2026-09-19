import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default NotFound;