import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiAward,
  FiCalendar,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    upcomingDeadlines: 0,
  });

  const [upcomingApplications, setUpcomingApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiRequest("/dashboard");

        setStats(data.stats);
        setUpcomingApplications(data.upcomingApplications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div className="dashboard-heading">
            <span className="eyebrow">
              WELCOME BACK, {user?.name?.toUpperCase() || "USER"}
            </span>

            <h1>Dashboard</h1>

            <p>Overview of your internship applications.</p>
          </div>

          <button
            className="add-application-button"
            onClick={() => navigate("/applications/new")}
          >
            + Add Application
          </button>
        </div>

        {loading && <p>Loading dashboard...</p>}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon stat-icon-blue">
                    <FiBriefcase />
                  </div>

                  <h2>{stats.totalApplications}</h2>
                </div>

                <p>Total Applications</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon stat-icon-purple">
                    <FiUsers />
                  </div>

                  <h2>{stats.interviews}</h2>
                </div>

                <p>Interviews</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon stat-icon-green">
                    <FiAward />
                  </div>

                  <h2>{stats.offers}</h2>
                </div>

                <p>Offers</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon stat-icon-orange">
                    <FiCalendar />
                  </div>

                  <h2>{stats.upcomingDeadlines}</h2>
                </div>

                <p>Upcoming Deadlines</p>
              </div>
            </div>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Upcoming Deadlines</h2>

                <button onClick={() => navigate("/applications")}>
                  View All
                </button>
              </div>

              {upcomingApplications.length === 0 ? (
                <div className="empty-state">
                  <p>No upcoming deadlines.</p>
                </div>
              ) : (
                <div className="applications-table-wrapper">
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcomingApplications.map((application) => (
                        <tr key={application.id}>
                          <td>{application.company}</td>
                          <td>{application.role}</td>

                          <td>
                            <span
                              className={`status-badge status-${application.status.toLowerCase()}`}
                            >
                              {application.status.replaceAll("_", " ")}
                            </span>
                          </td>

                          <td>
                            {new Date(
                              application.deadline
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            <button
                              onClick={() =>
                                navigate(
                                  `/applications/${application.id}`
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;