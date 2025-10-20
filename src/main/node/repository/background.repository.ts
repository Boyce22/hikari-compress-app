import { DatabaseSync } from 'node:sqlite';
import { camelToSnake, camelToSnakeKey, DatabaseManager, getDatabaseManager } from '../database';
import { BackgroundImage, convertRawToBackgroundImageObject } from '../../../shared/types/background-image';

interface BackgroundData {
  data: BackgroundImage;
}

export class BackgroundRepository {
  private db: DatabaseSync;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = getDatabaseManager();
    this.db = this.dbManager.getDatabase();
  }

  async register({ data }: BackgroundData) {
    const background = camelToSnake(data);

    const columns = Object.keys(background);

    const placeholders = columns.map((col) => `$${col}`).join(', ');

    const stmt = this.db.prepare(`
      INSERT INTO background (${columns.map(camelToSnakeKey).join(', ')})
      VALUES (${placeholders})
    `);

    stmt.run(background);
  }

  public findAll(): BackgroundImage[] {
    const stmt = this.db.prepare(`SELECT * FROM background bg WHERE bg.status = 1`);

    const raws = stmt.all();

    if (!raws.length) {
      throw new Error(`Backgrounds not found`);
    }

    return raws.map(convertRawToBackgroundImageObject);
  }

  public findById({ id }: { id: string }): BackgroundImage {
    const stmt = this.db.prepare(`SELECT * FROM background bg WHERE bg = $id`);

    const raw = stmt.get({ id });

    if (!raw) {
      throw new Error(`Settings not found for id: ${id}`);
    }

    return convertRawToBackgroundImageObject(raw);
  }
}
