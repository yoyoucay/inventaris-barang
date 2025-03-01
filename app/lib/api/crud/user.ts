import pool from "../../db";
import { User } from "../../definitions/user";

// Create a new user
export const createUser = async (user: User) => {
    const [result] = await pool.execute(
        `INSERT INTO tumx01 (sUserName, sFullName, sEmail, iStatus, iCreateBy) 
        VALUES (?, ?, ?)`,
        [user.sUserName, user.sFullName, user.sEmail, 1, 1]
    );
    return result;
};

// Read all users
export const getUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM tumx01');
    return rows;
};

// // Read a single user by ID
// export const getUserById = async (id: number) => {
//     const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
//     return rows[0];
// };

// // Update a user by ID
// export const updateUser = async (id: number, user: User) => {
//     const [result] = await pool.execute(
//         'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
//         [user.name, user.email, user.age, id]
//     );
//     return result;
// };

// // Delete a user by ID
// export const deleteUser = async (id: number) => {
//     const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
//     return result;
// };