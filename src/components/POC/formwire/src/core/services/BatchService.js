/**
 * Batch Service - Handles batching and queuing operations
 */

export class BatchService {
  constructor(options = {}) {
    this.options = {
      enableBatching: true,
      batchDelay: 0,
      maxBatchSize: 100,
      ...options,
    };

    // Batch state
    this.batchQueue = [];
    this.isBatching = false;
    this.batchScheduled = false;
    this.batchTimeout = null;

    // Statistics
    this.stats = {
      totalBatches: 0,
      totalOperations: 0,
      averageBatchSize: 0,
    };
  }

  /**
   * Start batching operations
   * @param {Function} fn - Function containing operations to batch
   * @param {Function} onFlush - Callback when batch is flushed
   */
  batch(fn, onFlush) {
    if (!this.options.enableBatching) {
      fn();

      return;
    }

    if (this.isBatching) {
      fn();

      return;
    }

    this.isBatching = true;
    this.batchQueue = [];

    try {
      fn();
    } finally {
      this.isBatching = false;

      this._flushBatch(onFlush);
    }
  }

  /**
   * Queue operation for batching
   * @param {Object} operation - Operation to queue
   */
  queueOperation(operation) {
    if (!this.options.enableBatching) {
      return;
    }

    this.batchQueue.push(operation);
    this.stats.totalOperations++;

    if (this.options.batchDelay > 0) {
      this._scheduleBatch();
    } else if (!this.batchScheduled) {
      this._scheduleMicrotaskBatch();
    }
  }

  /**
   * Schedule batch with timeout
   * @private
   */
  _scheduleBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this._flushBatch();
    }, this.options.batchDelay);
  }

  /**
   * Schedule batch with microtask
   * @private
   */
  _scheduleMicrotaskBatch() {
    this.batchScheduled = true;
    queueMicrotask(() => {
      this.batchScheduled = false;
      this._flushBatch();
    });
  }

  /**
   * Flush pending batch operations
   * @param {Function} onFlush - Callback when batch is flushed
   * @private
   */
  _flushBatch(onFlush) {
    if (this.batchQueue.length === 0) return;

    const operations = [...this.batchQueue];

    this.batchQueue = [];

    this.stats.totalBatches++;
    this.stats.averageBatchSize = this.stats.totalOperations / this.stats.totalBatches;

    if (onFlush) {
      onFlush(operations);
    }
  }

  /**
   * Clear all pending operations
   */
  clear() {
    this.batchQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    this.batchScheduled = false;
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.options = { ...this.options, ...newConfig };
  }

  /**
   * Get service statistics
   * @returns {Object} Batch service statistics
   */
  getStats() {
    return {
      ...this.stats,
      queueSize: this.batchQueue.length,
      isBatching: this.isBatching,
      batchScheduled: this.batchScheduled,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalBatches: 0,
      totalOperations: 0,
      averageBatchSize: 0,
    };
  }
}
