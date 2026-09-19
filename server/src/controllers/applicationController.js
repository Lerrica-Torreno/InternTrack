import pool from "../config/database.js";

export const createApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      location,
      dateApplied,
      deadline,
      status,
      contactPerson,
      applicationLink,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO applications (
        user_id,
        company,
        role,
        location,
        date_applied,
        deadline,
        status,
        contact_person,
        application_link,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        req.user.id,
        company.trim(),
        role.trim(),
        location || null,
        dateApplied || null,
        deadline || null,
        status || "TO_APPLY",
        contactPerson || null,
        applicationLink || null,
        notes || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Application created successfully.",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create application.",
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      applications: result.rows,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve applications.",
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE id = $1 AND user_id = $2
      `,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Get application error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve application.",
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      location,
      dateApplied,
      deadline,
      status,
      contactPerson,
      applicationLink,
      notes,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE applications
      SET
        company = $1,
        role = $2,
        location = $3,
        date_applied = $4,
        deadline = $5,
        status = $6,
        contact_person = $7,
        application_link = $8,
        notes = $9,
        updated_at = NOW()
      WHERE id = $10 AND user_id = $11
      RETURNING *
      `,
      [
        company,
        role,
        location || null,
        dateApplied || null,
        deadline || null,
        status,
        contactPerson || null,
        applicationLink || null,
        notes || null,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully.",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update application error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update application.",
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM applications
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete application.",
    });
  }
};