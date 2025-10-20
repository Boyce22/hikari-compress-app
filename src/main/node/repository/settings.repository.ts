import { DatabaseSync } from 'node:sqlite';

import { convertRawToSettingsObject, Settings } from '../../../shared/types/settings';
import { camelToSnakeKey, DatabaseManager, getDatabaseManager } from '../database';

interface SettingsData extends Partial<Omit<Settings, 'backgroundImage'>> {
  backgroundId?: string | null;
}

export class SettingsRepository {
  private db: DatabaseSync;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = getDatabaseManager();
    this.db = this.dbManager.getDatabase();
  }

  public update({ data, id = 'app_settings' }: { data: SettingsData; id?: string }) {
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
