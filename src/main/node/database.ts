import { app } from 'electron';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';

import type { Settings } from '@/shared/types/settings';

const DB_CONFIG = {
  DIRECTORY_NAME: 'data',
  FILE_NAME: 'hikari-db.sqlite',
  WAL_MODE: true,
};

const DB_PRAGMAS = {
  JOURNAL_MODE: 'WAL',
  SYNCHRONOUS: 'NORMAL',
  CACHE_SIZE: -64000, // 64MB
  BUSY_TIMEOUT: 5000, // 5 seconds
};

const TABLE_SCHEMAS = {
  HISTORY: `
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      original_size INTEGER NOT NULL,
      processed_at TEXT,
      compressed_size INTEGER,
      compression_ratio REAL,
      progress TEXT NOT NULL CHECK(progress IN ('waiting', 'processing', 'completed', 'error')),
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  SETTINGS: `
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY CHECK(id = 'app_settings'),
      codec TEXT NOT NULL DEFAULT 'libx264',
      quality TEXT NOT NULL DEFAULT 'medium',
      preset TEXT NOT NULL DEFAULT 'medium',
      resolution TEXT,
      fps INTEGER,
      ram INTEGER,
      keep_subtitles INTEGER NOT NULL DEFAULT 1,
      keep_audio INTEGER NOT NULL DEFAULT 1,
      audio_codec TEXT NOT NULL DEFAULT 'aac',
      audio_bitrate TEXT NOT NULL DEFAULT '128k',
      hardware_acceleration INTEGER NOT NULL DEFAULT 0,
      output_path TEXT,
      background_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

const TABLE_INDEXES = {
  HISTORY: [
    'CREATE INDEX IF NOT EXISTS idx_history_progress ON history(progress)',
    'CREATE INDEX IF NOT EXISTS idx_history_uploaded_at ON history(uploaded_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_history_compression_ratio ON history(compression_ratio) WHERE compression_ratio IS NOT NULL',
  ],
};

type TABLE_NAMES = Lowercase<keyof typeof TABLE_SCHEMAS>;

const DEFAULT_SETTINGS: Settings = {
  id: 'app_settings',
  codec: 'libx264',
  quality: 'medium',
  preset: 'medium',
  resolution: '1920x1080',
  fps: 30,
  ram: 2,
  keepSubtitles: true,
  keepAudio: true,
  audioCodec: 'aac',
  audioBitrate: '128k',
  hardwareAcceleration: false,
  outputPath: '/Downloads/HikariCompress',
  backgroundImage: null,
};

class DatabaseManager {
  private static instance: DatabaseManager;
  private readonly db: DatabaseSync;
  private readonly dbPath: string;

  private constructor() {
    this.dbPath = this.initializeDatabasePath();
    this.db = new DatabaseSync(this.dbPath);
    this.configureDatabase();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeDatabasePath(): string {
    const dbDirectory = join(app.getPath('userData'), DB_CONFIG.DIRECTORY_NAME);

    if (!existsSync(dbDirectory)) {
      mkdirSync(dbDirectory, { recursive: true, mode: 0o755 });

      if (!existsSync(dbDirectory)) {
        throw new Error(`Failed to create database directory: ${dbDirectory}`);
      }
    }

    return join(dbDirectory, DB_CONFIG.FILE_NAME);
  }

  private configureDatabase(): void {
    try {
      if (DB_CONFIG.WAL_MODE) {
        this.db.exec(`PRAGMA journal_mode = ${DB_PRAGMAS.JOURNAL_MODE};`);
      }

      this.db.exec(`PRAGMA synchronous = ${DB_PRAGMAS.SYNCHRONOUS};`);
      this.db.exec(`PRAGMA cache_size = ${DB_PRAGMAS.CACHE_SIZE};`);
      this.db.exec('PRAGMA foreign_keys = ON;');
      this.db.exec(`PRAGMA busy_timeout = ${DB_PRAGMAS.BUSY_TIMEOUT};`);

      console.log(`Database initialized at: ${this.dbPath}`);
    } catch (error) {
      console.error('Failed to configure database:', error);
      throw error;
    }
  }

  public initializeTables(): void {
    this.db.exec('BEGIN TRANSACTION;');

    try {
      this.createTable('history', TABLE_SCHEMAS.HISTORY);
      this.createIndexes('history', TABLE_INDEXES.HISTORY);

      this.createTable('settings', TABLE_SCHEMAS.SETTINGS);

      this.db.exec('COMMIT;');
      console.log('All tables initialized successfully');
    } catch (error) {
      this.db.exec('ROLLBACK;');
      console.error('Failed to initialize tables:', error);
      throw error;
    }
  }

  private createTable(name: TABLE_NAMES, schema: string): void {
    try {
      this.db.exec(schema);
      console.log(`Table '${name}' initialized successfully`);
    } catch (error) {
      console.error(`Table creation error for '${name}':`, error);
      throw error;
    }
  }

  private createIndexes(tableName: TABLE_NAMES, indexes: readonly string[]): void {
    if (!indexes?.length) return;

    indexes.forEach((indexSql) => {
      try {
        this.db.exec(indexSql);
      } catch (error) {
        console.error(`Index creation error for '${tableName}':`, error);
        throw error;
      }
    });

    console.log(`Indexes for '${tableName}' initialized successfully`);
  }

  public initializeDefaultSettings(): void {
    const { keepSubtitles, keepAudio, hardwareAcceleration, backgroundImage, ...rest } = DEFAULT_SETTINGS;

    const settings = camelToSnake({
      ...rest,
      keepSubtitles: Number(keepSubtitles),
      keepAudio: Number(keepAudio),
      hardwareAcceleration: Number(hardwareAcceleration),
      backgroundImage: backgroundImage ? JSON.stringify(backgroundImage) : null,
    });

    this.db.exec('BEGIN;');
    try {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO settings (
          id, codec, quality, preset, resolution, fps, ram,
          keep_subtitles, keep_audio, audio_codec, audio_bitrate,
          hardware_acceleration, output_path, background_image
        ) VALUES (
          $id, $codec, $quality, $preset, $resolution, $fps, $ram,
          $keep_subtitles, $keep_audio, $audio_codec, $audio_bitrate,
          $hardware_acceleration, $output_path, $background_image
        )
      `);

      stmt.run(settings);
      this.db.exec('COMMIT;');
      console.log('Default settings initialized');
    } catch (error) {
      this.db.exec('ROLLBACK;');
      console.error('Failed to initialize default settings:', error);
      throw error;
    }
  }

  public getDatabase(): DatabaseSync {
    return this.db;
  }

  public close(): void {
    try {
      this.db?.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }
  }

  public healthCheck(): boolean {
    try {
      this.db.exec('SELECT 1;');
      return true;
    } catch {
      return false;
    }
  }

  public getDatabaseSize(): number {
    try {
      const result = this.db
        .prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();')
        .get() as { size: number };
      return result.size;
    } catch {
      return -1;
    }
  }
}

export const camelToSnake = <T extends Record<string, any>>(obj: T): Record<string, any> =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    acc[snakeKey] = value;
    return acc;
  }, {});

export const initializeDatabase = (): DatabaseManager => {
  const dbManager = DatabaseManager.getInstance();

  dbManager.initializeTables();
  dbManager.initializeDefaultSettings();

  if (!dbManager.healthCheck()) {
    throw new Error('Database health check failed after initialization');
  }

  console.log('Database initialization completed successfully');
  return dbManager;
};

export const getDatabaseManager = (): DatabaseManager => {
  return DatabaseManager.getInstance();
};

export const runMigrations = (): void => {
  const migrations: readonly string[] = [];

  if (!migrations.length) return;

  const db = getDatabaseManager().getDatabase();

  migrations.forEach((migration, index) => {
    try {
      db.exec(migration);
      console.log(`Migration ${index + 1} applied successfully`);
    } catch (error) {
      console.error(`Failed to apply migration ${index + 1}:`, error);
    }
  });
};

export const testDatabase  = (): void => {
  const dbManager = initializeDatabase();

  console.log('Database health check:', dbManager.healthCheck() ? 'PASS' : 'FAIL');
  console.log('Database size:', dbManager.getDatabaseSize(), 'bytes');

  runMigrations();
  console.log('Database test completed successfully');
};

export type { DatabaseManager };
