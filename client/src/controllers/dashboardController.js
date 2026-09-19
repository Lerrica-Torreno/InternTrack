import pool from "../config/database.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const statsResult = await pool.query(
      `
      SELECT
        COUNT(*) AS total_applications,

        COUNT(*) FILTER (
          WHERE status = 'INTERVIEW'
        ) AS interviews,

        COUNT(*) FILTER (
          WHERE status = 'OFFER'
        ) AS offers,

        COUNT(*) FILTER (
          WHERE deadline IS NOT NULL
          AND deadline >= CURRENT_DATE
          AND deadline <= CURRENT_DATE + INTERVAL '7 days'
          AND status NOT IN ('REJECTED', 'WITHDRAWN')
        ) AS upcoming_deadlines

      FROM applications
      WHERE user_id = $1
      `,
      [userId]
    );

    const deadlinesResult = await pool.query(
      `
      SELECT
        id,
        company,
        role,
        deadline,
        status
      FROM applications
      WHERE user_id = $1
        AND deadline IS NOT NULL
        AND deadline >= CURRENT_DATE
        AND status NOT IN ('REJECTED', 'WITHDRAWN')
      ORDER BY deadline ASC
      LIMIT 5
      `,
      [userId]
    );

    const stats = statsResult.rows[0];

    res.status(200).json({
      success: true,
      stats: {
        totalApplications: Number(stats.total_applications),
        interviews: Number(stats.interviews),
        offers: Number(stats.offers),
        upcomingDeadlines: Number(stats.upcoming_deadlines),
      },
      upcomingApplications: deadlinesResult.rows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard data.",
    });
  }
};