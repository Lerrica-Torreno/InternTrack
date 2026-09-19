import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

function AddApplication() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    dateApplied: "",
    deadline: "",
    status: "TO_APPLY",
    contactPerson: "",
    applicationLink: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.company.trim()) {
      return "Company is required.";
    }

    if (!form.role.trim()) {
      return "Role is required.";
    }

    if (
      form.applicationLink &&
      !/^https?:\/\/.+/i.test(form.applicationLink)
    ) {
      return "Application link must start with http:// or https://";
    }

    if (
      form.dateApplied &&
      form.deadline &&
      new Date(form.deadline) < new Date(form.dateApplied)
    ) {
      return "Deadline cannot be earlier than the date applied.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await apiRequest("/applications", {
        method: "POST",
        body: JSON.stringify(form),
      });

      navigate("/applications");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="form-card">
          <h1>Add Application</h1>

          {error && <div className="error-message">{error}</div>}

          <form className="application-form" onSubmit={handleSubmit}>
            <label>Company *</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />

            <label>Role *</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            <label>Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
            />

            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="TO_APPLY">To Apply</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>

            <label>Contact Person</label>
            <input
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
            />

            <label>Application Link</label>
            <input
              type="url"
              name="applicationLink"
              value={form.applicationLink}
              onChange={handleChange}
              placeholder="https://..."
            />

            <label>Notes</label>
            <textarea
              name="notes"
              rows="5"
              value={form.notes}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/applications")}
              >
                Cancel
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default AddApplication;