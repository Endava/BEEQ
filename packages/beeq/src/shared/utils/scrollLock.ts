import { isClient } from './isClient';

interface ScrollLockConfig {
  /** Enable debug logging */
  debug?: boolean;
  /** CSS class name to apply to body when locked */
  bodyClassName?: string;
}

/**
 * Global state for scroll lock management
 */
const state = {
  lockCount: 0, // The lockCount tracks how many components or floating overlays currently need the scroll to be locked.
  config: {
    debug: false,
    bodyClassName: 'bq-body--scroll-lock',
  } as Required<ScrollLockConfig>,
};

/**
 * Logs debug messages when debug mode is enabled
 *
 * @param message - The debug message to log
 */
const logDebug = (message: string): void => {
  if (!state.config.debug) return;

  console.log(`[BEEQ ScrollLock] ${message}`);
};

/**
 * Applies or removes scroll lock CSS class
 *
 * @param shouldLock - Whether to apply or remove the scroll lock class
 */
const toggleScrollLockClass = (shouldLock: boolean): void => {
  const action = shouldLock ? 'add' : 'remove';
  document.body.classList[action](state.config.bodyClassName);
};

/**
 * Configure the scroll lock behavior
 *
 * @param config - Partial configuration object to override defaults
 */
export const configureScrollLock = (config: Partial<ScrollLockConfig>): void => {
  state.config = { ...state.config, ...config };
};

/**
 * Gets current scroll lock count
 */
export const getScrollLockCount = (): number => {
  return state.lockCount;
};

/**
 * Check if body scroll is currently locked
 */
export const isBodyScrollLocked = (): boolean => {
  return state.lockCount > 0;
};

/**
 * Locks body scroll with reference counting
 * Multiple calls require the same number of unlockBodyScroll() calls
 */
export const lockBodyScroll = (): void => {
  if (!isClient()) return;

  state.lockCount++;

  // Only apply lock on first request
  if (state.lockCount !== 1) return;

  toggleScrollLockClass(true);
  logDebug(`Body scroll locked (count: ${state.lockCount})`);
};

/**
 * Unlocks body scroll with reference counting
 * Safe to call even when not locked
 */
export const unlockBodyScroll = (): void => {
  if (!isClient()) return;
  if (state.lockCount === 0) return;

  state.lockCount = Math.max(0, state.lockCount - 1);

  // Only remove lock when all requests are cleared
  if (state.lockCount !== 0) return;

  toggleScrollLockClass(false);
  logDebug(`Body scroll unlocked (count: ${state.lockCount})`);
};

/**
 * Force unlock all body scroll locks (cleanup utility)
 * Useful for cleanup scenarios or error recovery
 */
export const forceUnlockAllBodyScroll = (): void => {
  if (!isClient()) return;
  if (state.lockCount === 0) return;

  state.lockCount = 0;
  toggleScrollLockClass(false);
  logDebug('All body scroll locks forcefully removed');
};
