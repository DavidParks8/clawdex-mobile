import {
  type AppStateAction,
  type AppStateData,
  type AppStatePersistenceAdapter,
  AppStatePersistenceError,
  type AppStateSnapshot,
  createDefaultAppStateData,
} from './model';
import {
  appStateReducer,
  importLegacyAppState,
  parsePersistedAppState,
  persistenceError,
  serializeAppState,
} from './reducer';

export class AppStateStore {
  private snapshot: AppStateSnapshot = {
    loaded: false,
    data: createDefaultAppStateData(),
    persistenceError: null,
  };
  private readonly listeners = new Set<() => void>();
  private initializePromise: Promise<void> | null = null;
  private initializedSuccessfully = false;
  private pendingData: AppStateData | null = null;
  private writeLoop: Promise<void> | null = null;
  private durableChain: Promise<unknown> = Promise.resolve();
  private durableRequests = 0;
  private readonly queuedActions: AppStateAction[] = [];

  constructor(private readonly persistence: AppStatePersistenceAdapter) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  readonly getSnapshot = (): AppStateSnapshot => this.snapshot;

  initialize(): Promise<void> {
    if (!this.initializePromise) {
      this.initializePromise = this.loadInitialState();
    }
    return this.initializePromise;
  }

  dispatch(action: AppStateAction): void {
    if (!this.snapshot.loaded) {
      throw new Error('App state has not loaded.');
    }
    if (this.durableRequests > 0) {
      this.queuedActions.push(action);
      return;
    }
    this.publish(appStateReducer(this.snapshot.data, action), null);
    this.queuePersistence(this.snapshot.data);
  }

  dispatchDurable(action: AppStateAction): Promise<AppStateData> {
    this.durableRequests += 1;
    const operation = this.durableChain.then(() => this.applyDurable(action));
    this.durableChain = operation.catch(() => undefined);
    return operation;
  }

  async retryPersistence(): Promise<void> {
    if (!this.initializedSuccessfully) {
      this.initializePromise = null;
      await this.initialize();
      return;
    }
    if (this.writeLoop) {
      await this.writeLoop;
    }
    this.pendingData = this.snapshot.data;
    this.publish(this.snapshot.data, null);
    this.startWriteLoop();
    await this.flushPersistence();
  }

  async flushPersistence(): Promise<void> {
    if (this.pendingData && !this.writeLoop) {
      this.publish(this.snapshot.data, null);
      this.startWriteLoop();
    }
    await this.writeLoop;
    if (this.snapshot.persistenceError) {
      throw this.snapshot.persistenceError;
    }
  }

  private async loadInitialState(): Promise<void> {
    try {
      const raw = await this.persistence.readCurrent().catch((error) => {
        throw persistenceError('read_failed', 'load', 'Could not load saved app state.', error);
      });
      if (raw !== null) {
        const data = parsePersistedAppState(raw);
        this.pendingData = null;
        this.initializedSuccessfully = true;
        this.publish(data, null, true);
        return;
      }

      const legacy = await this.persistence.readLegacy().catch((error) => {
        throw persistenceError(
          'read_failed',
          'import',
          'Could not import the existing app settings.',
          error
        );
      });
      const data = importLegacyAppState(legacy);
      try {
        await this.persistence.writeCurrent(serializeAppState(data));
        this.pendingData = null;
        this.initializedSuccessfully = true;
        this.publish(data, null, true);
      } catch (error) {
        this.pendingData = data;
        this.publish(
          data,
          persistenceError(
            'write_failed',
            'import',
            'Imported settings could not be saved. Retry before changing connections.',
            error
          ),
          true
        );
      }
    } catch (error) {
      this.publish(
        this.snapshot.data,
        error instanceof AppStatePersistenceError
          ? error
          : persistenceError('read_failed', 'load', 'Could not load saved app state.', error),
        true
      );
    }
  }

  private async applyDurable(action: AppStateAction): Promise<AppStateData> {
    if (!this.snapshot.loaded) {
      await this.initialize();
    }
    try {
      await this.flushPersistence();
      const nextData = appStateReducer(this.snapshot.data, action);
      try {
        await this.persistence.writeCurrent(serializeAppState(nextData));
      } catch (error) {
        const typedError = persistenceError(
          'write_failed',
          'write',
          'The app-state change was not saved. Please retry.',
          error
        );
        this.publish(this.snapshot.data, typedError);
        throw typedError;
      }
      this.initializedSuccessfully = true;
      this.publish(nextData, null);
      return nextData;
    } finally {
      this.durableRequests -= 1;
      if (this.durableRequests === 0) {
        this.applyQueuedActions();
      }
    }
  }

  private applyQueuedActions(): void {
    if (this.queuedActions.length === 0) {
      return;
    }
    let data = this.snapshot.data;
    for (const action of this.queuedActions.splice(0)) {
      data = appStateReducer(data, action);
    }
    this.publish(data, null);
    this.queuePersistence(data);
  }

  private queuePersistence(data: AppStateData): void {
    this.pendingData = data;
    this.startWriteLoop();
  }

  private startWriteLoop(): void {
    if (this.writeLoop || !this.pendingData) {
      return;
    }
    this.writeLoop = Promise.resolve()
      .then(async () => {
        while (this.pendingData) {
          const data = this.pendingData;
          this.pendingData = null;
          try {
            await this.persistence.writeCurrent(serializeAppState(data));
            this.initializedSuccessfully = true;
            this.publish(this.snapshot.data, null);
          } catch (error) {
            this.pendingData = this.pendingData ?? data;
            this.publish(
              this.snapshot.data,
              persistenceError(
                'write_failed',
                'write',
                'Settings could not be saved. Retry to persist the latest changes.',
                error
              )
            );
            return;
          }
        }
      })
      .finally(() => {
        this.writeLoop = null;
      });
  }

  private publish(
    data: AppStateData,
    persistenceErrorState: AppStatePersistenceError | null,
    loaded = this.snapshot.loaded
  ): void {
    this.snapshot = { loaded, data, persistenceError: persistenceErrorState };
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export function createAppStateStore(
  persistence: AppStatePersistenceAdapter
): AppStateStore {
  return new AppStateStore(persistence);
}
