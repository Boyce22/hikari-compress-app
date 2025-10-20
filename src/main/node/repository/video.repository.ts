import { DatabaseSync } from 'node:sqlite';
import { camelToSnake, camelToSnakeKey, DatabaseManager, getDatabaseManager } from '../database';
import { convertRawToVideoObject, FindAllVideoParams, VideoFile, PaginatedVideo } from '../../../shared/types/video';

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

  public findAll({
    page = 1,
    limit = 10,
    orderBy = 'uploadedAt',
    orderDir = 'DESC',
  }: FindAllVideoParams = {}): PaginatedVideo {
    const offset = (page - 1) * limit;

    const stmt = this.db.prepare(`
      SELECT *
      FROM video
      ORDER BY ${camelToSnakeKey(orderBy)} ${orderDir}
      LIMIT $limit OFFSET $offset
    `);

    const totalStmt = this.db.prepare(`SELECT COUNT(*) as total FROM video`);

    const total = totalStmt.get()?.total ?? 0;

    const rows = stmt.all({ limit, offset });

    const items = rows.length ? rows.map(convertRawToVideoObject) : [];

    return { items, total: Number(total), page, limit };
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
