import { DatabaseSync } from 'node:sqlite';
import { convertRawToVideoObject, VideoFile } from '../../../shared/types/video';
import { camelToSnake, camelToSnakeKey, DatabaseManager, getDatabaseManager } from '../database';

export class VideoRepository {
  private db: DatabaseSync;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = getDatabaseManager();
    this.db = this.dbManager.getDatabase();
  }

  public register({ data }: { data: VideoFile }) {
    const record = camelToSnake(data);
    const columns = Object.keys(record);
    const placeholders = columns.map((col) => `$${col}`).join(', ');

    const stmt = this.db.prepare(`
      INSERT INTO video (${columns.map(camelToSnakeKey).join(', ')})
      VALUES (${placeholders})
    `);

    stmt.run(record);
  }

  public findAll(): VideoFile[] {
    const stmt = this.db.prepare(`
      SELECT *
      FROM video
      ORDER BY processed_at ASC
    `);

    const rows = stmt.all();

    return rows.length ? rows.map(convertRawToVideoObject) : [];
  }

  public findById({ id }: { id: string }): VideoFile {
    const stmt = this.db.prepare(`SELECT * FROM video WHERE id = $id`);
    const raw = stmt.get({ id });

    if (!raw) {
      throw new Error(`Video not found for id: ${id}`);
    }

    return convertRawToVideoObject(raw);
  }
}
