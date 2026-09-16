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
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `DELETE FROM historico_chamados
             WHERE user_id = $1`,
            [id]
        );

        const result = await client.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const entrar = async (email) => {
    const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE email = $1`,
            [email]
        );

    return result.rows[0];
}

module.exports = {
    create,
    deleteUserById,
    entrar
};