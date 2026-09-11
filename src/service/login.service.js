const pool = require("../database/database");

const create = async (name, email, passwordHash, role) => {

    const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, email, passwordHash, role]
    );

    return result.rows[0];

};

const deleteUserById = async (id) => {
    const result = await pool.query(
        `DELETE FROM users
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    create,
    deleteUserById
};