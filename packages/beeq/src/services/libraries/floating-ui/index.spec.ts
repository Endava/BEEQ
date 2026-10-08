import { autoUpdate, computePosition } from '@floating-ui/dom';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { FloatingUI } from '.';

vi.mock('@floating-ui/dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('@floating-ui/dom')>();
  return { ...original, autoUpdate: vi.fn(), computePosition: vi.fn() };
});

type Position = Awaited<ReturnType<typeof computePosition>>;
const position: Position = { x: 40, y: 60, placement: 'top', strategy: 'absolute', middlewareData: {} };
const deferredPosition = () => {
  let resolve!: (position: Position) => void;
  const promise = new Promise<Position>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

describe('FloatingUI', () => {
  let trigger: HTMLElement;
  let panel: HTMLElement;
  let floating: FloatingUI;
  let cleanup: Mock<ReturnType<typeof autoUpdate>>;

  beforeEach(() => {
    trigger = document.createElement('div');
    panel = document.createElement('div');
    document.body.append(trigger, panel);
    floating = new FloatingUI(trigger, panel);
    cleanup = vi.fn<ReturnType<typeof autoUpdate>>();
    vi.mocked(autoUpdate).mockReturnValue(cleanup);
    vi.mocked(computePosition).mockResolvedValue(position);
  });

  afterEach(() => {
    floating.stop();
    trigger.remove();
    panel.remove();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('should retain default tracking for callers without options', () => {
    floating.start();

    expect(autoUpdate).toHaveBeenCalledWith(trigger, panel, expect.any(Function), undefined);
  });

  it('should forward frame tracking and create only one active subscription', () => {
    floating.start({ animationFrame: true });
    floating.start({ animationFrame: true });

    expect(autoUpdate).toHaveBeenCalledTimes(1);
    expect(autoUpdate).toHaveBeenCalledWith(trigger, panel, expect.any(Function), { animationFrame: true });
  });

  it('should stop idempotently and resume tracking on restart', () => {
    floating.stop();
    floating.start({ animationFrame: true });
    floating.stop();
    floating.stop();

    expect(cleanup).toHaveBeenCalledTimes(1);
    floating.start({ animationFrame: true });
    expect(autoUpdate).toHaveBeenCalledTimes(2);
  });

  it('should reposition from the tracking callback', async () => {
    floating.start({ animationFrame: true });
    const update = vi.mocked(autoUpdate).mock.calls[0][2];

    update();
    await Promise.resolve();

    expect(computePosition).toHaveBeenCalledTimes(1);
    expect(panel.style.transform).toBe('translate(40px, 60px)');
  });

  it('should configure stopped instances without computing a position', () => {
    panel.style.width = '100px';
    floating.configure({ distance: 12, sameWidth: false });

    expect(computePosition).not.toHaveBeenCalled();
    expect(floating.options.distance).toBe(12);
    expect(panel.style.width).toBe('');
  });

  it('should configure active instances without rebuilding their subscription', async () => {
    floating.start({ animationFrame: true });
    floating.configure({ placement: 'left', distance: 12 });
    await Promise.resolve();

    expect(autoUpdate).toHaveBeenCalledTimes(1);
    expect(computePosition).toHaveBeenCalledTimes(1);
    expect(computePosition).toHaveBeenCalledWith(trigger, panel, expect.objectContaining({ placement: 'left' }));
  });

  it('should discard positions that resolve after tracking stops', async () => {
    const pending = deferredPosition();
    const onPositionChange = vi.fn();
    floating.configure({ onPositionChange });
    vi.mocked(computePosition).mockReturnValueOnce(pending.promise);
    const update = floating.reposition();

    floating.stop();
    pending.resolve(position);
    await update;

    expect(panel.style.transform).toBe('');
    expect(onPositionChange).not.toHaveBeenCalled();
  });

  it('should discard stale positions after a newer update', async () => {
    const pending = deferredPosition();
    vi.mocked(computePosition).mockReturnValueOnce(pending.promise);
    const oldUpdate = floating.reposition();
    const newPosition = { ...position, x: 80 };
    vi.mocked(computePosition).mockResolvedValueOnce(newPosition);
    await floating.reposition();
    pending.resolve(position);
    await oldUpdate;

    expect(panel.style.transform).toBe('translate(80px, 60px)');
  });

  it('should retain default tracking for a virtual panel reference', () => {
    const reference = { getBoundingClientRect: () => trigger.getBoundingClientRect(), contextElement: trigger };
    const panelFloating = new FloatingUI(reference, panel);

    try {
      panelFloating.start();
      expect(autoUpdate).toHaveBeenCalledWith(reference, panel, expect.any(Function), undefined);
    } finally {
      panelFloating.stop();
    }
  });
});
