import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await apiRequest("/applications");
        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/applications/${id}`, {
        method: "DELETE",
      });

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((application) => {
        return (
          application.company?.toLowerCase().includes(query) ||
          application.role?.toLowerCase().includes(query) ||
          application.location?.toLowerCase().includes(query)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (application) => application.status === statusFilter
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "OLDEST":
          return new Date(a.created_at) - new Date(b.created_at);

        case "COMPANY_ASC":
          return a.company.localeCompare(b.company);

        case "COMPANY_DESC":
          return b.company.localeCompare(a.company);

        case "DEADLINE_ASC": {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;

          return new Date(a.deadline) - new Date(b.deadline);
        }

        case "NEWEST":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return result;
  }, [applications, search, statusFilter, sortBy]);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>My Applications</h1>
            <p>Track and manage your internship applications.</p>
          </div>

          <button onClick={() => navigate("/applications/new")}>
            + Add Application
          </button>
        </div>

        <div className="application-controls">
          <input
            type="text"
            placeholder="Search company, role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="TO_APPLY">To Apply</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="COMPANY_ASC">Company A-Z</option>
            <option value="COMPANY_DESC">Company Z-A</option>
            <option value="DEADLINE_ASC">Nearest Deadline</option>
          </select>
        </div>

        {loading && <p>Loading applications...</p>}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          applications.length > 0 &&
          filteredApplications.length === 0 && (
            <div className="empty-state">
              <h2>No matching applications</h2>
              <p>Try changing your search or filter.</p>
            </div>
          )}

        {!loading && !error && applications.length === 0 && (
          <div className="empty-state">
            <h2>No applications yet</h2>
            <p>Add your first internship application.</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredApplications.length > 0 && (
            <>
              <p className="results-count">
                Showing {filteredApplications.length} of{" "}
                {applications.length} applications
              </p>

              <div className="applications-table-wrapper">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Date Applied</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.company}</td>

                        <td>{application.role}</td>

                        <td>{application.location || "-"}</td>

                        <td>
                          <span className={`status-badge status-${application.status.toLowerCase()}`}>
                            {application.status
                              ? application.status.replaceAll("_", " ")
                              : "-"}
                          </span>
                        </td>

                        <td>
                          {application.date_applied
                            ? new Date(
                                application.date_applied
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          {application.deadline
                            ? new Date(
                                application.deadline
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() =>
                                navigate(
                                  `/applications/${application.id}`
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/applications/${application.id}/edit`
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(application.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </main>
    </>
  );
}

export default Applications;