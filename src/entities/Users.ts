import path from "path";
import { Database } from "sqlite3";

interface User {
  id: number;
  external_id: number;
  admin: number;
  subscription_level: number | null;
  status: number;
  tag_id: number | null;
}

export async function getUser(external_id: number): Promise<User | undefined> {
  const db = new Database(path.join(__dirname, "data", "database.sqlite"));

  try {
    return new Promise<User | undefined>((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE external_id = ?",
        [external_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as User | undefined);
          }
        }
      );
    });
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}

export async function getAllUsers(): Promise<User[]> {
  const db = new Database(path.join(__dirname, "data", "database.sqlite"));

  try {
    return new Promise<User[]>((resolve, reject) => {
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as User[]);
        }
      });
    });
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}

export async function authUser(external_id: number): Promise<void> {
  const db = new Database(path.join(__dirname, "data", "database.sqlite"));

  // TODO: create connection between user and "register" tag using user_id and tag_id at user_tag table
}
