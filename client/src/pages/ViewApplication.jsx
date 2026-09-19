import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

function ViewApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await apiRequest(`/applications/${id}`);
        setApplication(data.application);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p>Loading application...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="error-message">{error}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="details-card">
          <div className="details-header">
            <div>
              <h1>{application.company}</h1>
              <p>{application.role}</p>
            </div>

            <div className="details-actions">
              <button onClick={() => navigate("/applications")}>
                Back
              </button>

              <button
                onClick={() =>
                  navigate(`/applications/${application.id}/edit`)
                }
              >
                Edit
              </button>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span>{application.company}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span>{application.role}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span>{application.location || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Status</span>
                <span>
                <span className={`status-badge status-${application.status.toLowerCase()}`}
    >
      {application.status.replaceAll("_", " ")}
              </span>
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Date Applied</span>
              <span>
                {application.date_applied
                  ? new Date(
                      application.date_applied
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Deadline</span>
              <span>
                {application.deadline
                  ? new Date(
                      application.deadline
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Contact Person</span>
              <span>{application.contact_person || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Application Link</span>

              {application.application_link ? (
                <a
                  href={application.application_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Application Link
                </a>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>

          <div className="notes-section">
            <h3>Notes</h3>
            <p>{application.notes || "No notes added."}</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default ViewApplication;