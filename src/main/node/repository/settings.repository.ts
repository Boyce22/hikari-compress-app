import { DatabaseSync } from 'node:sqlite';

import { camelToSnakeKey, DatabaseManager, getDatabaseManager } from '../database';
import { convertRawToSettingsObject, Settings, SettingsUpdateData } from '../../../shared/types/settings';

export class SettingsRepository {
  private db: DatabaseSync;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = getDatabaseManager();
    this.db = this.dbManager.getDatabase();
  }

  public update({ data, id = 'app_settings' }: SettingsUpdateData) {
    const columns = Object.keys(data);

    const assignments = columns.map((col) => `${camelToSnakeKey(col)} = $${col}`).join(', ');

    const stmt = this.db.prepare(`
      UPDATE settings
      SET ${assignments},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $id
    `);

    stmt.run({ ...data, id });
  }

  public findById({ id = 'app_settings' }): Settings {
    const stmt = this.db.prepare(
      `SELECT * FROM settings s LEFT OUTER JOIN background bg ON bg.id = s.background_id WHERE s.id = $id`,
    );

    const raw = stmt.get({ id });

    if (!raw) {
      throw new Error(`Settings not found for id: ${id}`);
    }

    return convertRawToSettingsObject(raw);
  }
}
