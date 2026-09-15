const pool = require("../database/database");


const create = async (titulo, descricao, prioridade, user_id) => {

    const result = await pool.query(
        `INSERT INTO chamados (titulo, descricao, prioridade, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [titulo, descricao, prioridade, user_id]
    );

    return result.rows[0];
};

const list = async () => {
    const result = await pool.query("SELECT * FROM chamados");

    return result.rows;
}

const listbyuser = async (id) => {
    const result = await pool.query(
        "SELECT * FROM chamados where user_id = $1",
        [id]
    );

    return result.rows;
}

const update = async (titulo, descricao, prioridade, id, user_id) => {
    const result = await pool.query(
            `UPDATE chamados
                SET titulo = $1, descricao = $2, prioridade = $3, user_id = $5
                WHERE id = $4
                RETURNING *`,
            [titulo, descricao, prioridade, id, user_id]
        );

    return result.rows[0];
}

const update_status = async (status, id, userid) => {

    const chamado = await pool.query(
            `SELECT * FROM chamados WHERE id = $1`,
            [id]
    );

    const statusAnterior = chamado.rows[0].status;

    const result = await pool.query(
            `UPDATE chamados
                SET status = $1
                WHERE id = $2
                RETURNING *`,
            [status, id]
    );

    await pool.query(
            `INSERT INTO historico_chamados
                (chamado_id, user_id, status_anterior, status_novo)
            VALUES ($1, $2, $3, $4)`,
            [id, userid, statusAnterior, status]
    );

    return result.rows[0];
}

const update_priority = async (id, prioridade) => {
    const result = await pool.query(
                `UPDATE chamados
                SET prioridade = $1
                WHERE id = $2
                RETURNING *`,
                [prioridade, id]
    );
    
    return result.rows[0];
}

const delete_chamado = async (id) => {
    const result = await pool.query(
        `DELETE FROM chamados
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}

module.exports = {
    create,
    list,
    update,
    update_status,
    update_priority,
    delete_chamado,
    listbyuser
};