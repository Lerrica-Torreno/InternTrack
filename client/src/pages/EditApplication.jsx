import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

function EditApplication() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await apiRequest(`/applications/${id}`);
        const application = data.application;

        setForm({
          company: application.company || "",
          role: application.role || "",
          location: application.location || "",

          dateApplied: application.date_applied
            ? application.date_applied.slice(0, 10)
            : "",

          deadline: application.deadline
            ? application.deadline.slice(0, 10)
            : "",

          status: application.status || "TO_APPLY",

          contactPerson: application.contact_person || "",

          applicationLink: application.application_link || "",

          notes: application.notes || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
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
    setSaving(true);

    try {
      await apiRequest(`/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      navigate(`/applications/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="form-card">
          <h1>Edit Application</h1>
          <p>Update the details of your internship application.</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form
            className="application-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="company">
              Company *
            </label>

            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              required
            />

            <label htmlFor="role">
              Role *
            </label>

            <input
              id="role"
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              required
            />

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
            />

            <label htmlFor="dateApplied">
              Date Applied
            </label>

            <input
              id="dateApplied"
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
            />

            <label htmlFor="deadline">
              Deadline
            </label>

            <input
              id="deadline"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="TO_APPLY">
                To Apply
              </option>

              <option value="APPLIED">
                Applied
              </option>

              <option value="INTERVIEW">
                Interview
              </option>

              <option value="OFFER">
                Offer
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="WITHDRAWN">
                Withdrawn
              </option>
            </select>

            <label htmlFor="contactPerson">
              Contact Person
            </label>

            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              value={form.contactPerson}
              onChange={handleChange}
            />

            <label htmlFor="applicationLink">
              Application Link
            </label>

            <input
              id="applicationLink"
              name="applicationLink"
              type="url"
              value={form.applicationLink}
              onChange={handleChange}
              placeholder="https://..."
            />

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows="5"
              value={form.notes}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button
                type="button"
                onClick={() =>
                  navigate(`/applications/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default EditApplication;