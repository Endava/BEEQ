// Define an interface for the window object with the CHROMATIC_MODE property
interface WindowWithChromatic extends Window {
  CHROMATIC_MODE?: boolean;
}

/**
 * Check if running in Chromatic environment
 */
export const isChromatic = () => {
  // Check if we're in a Chromatic build environment
  return (
    Boolean(window.navigator.userAgent.match(/Chromatic/i)) || Boolean((window as WindowWithChromatic).CHROMATIC_MODE)
  );
};

/**
 * Creates parameters to completely skip taking snapshots of specific stories in Chromatic
 */
export const skipSnapshotParameters = {
  chromatic: { disableSnapshot: true },
};
