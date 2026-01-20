import { describe, it, expect } from 'vitest';
import { formatTokens, usageTooltipFormatter } from './UsageGraph';

describe('UsageGraph tooltip formatter', () => {
  it('handles undefined value by defaulting to 0', () => {
    const [formatted, label] = usageTooltipFormatter(undefined);

    expect(formatted).toBe('0');
    expect(label).toBe('Tokens');
  });

  it('returns correctly formatted tokens string', () => {
    expect(usageTooltipFormatter(0)[0]).toBe('0');
    expect(usageTooltipFormatter(999)[0]).toBe('999');
    expect(usageTooltipFormatter(1000)[0]).toBe('1.0K');
    expect(usageTooltipFormatter(1500)[0]).toBe('1.5K');
    expect(usageTooltipFormatter(1_000_000)[0]).toBe('1.0M');
  });

  it('uses the same formatting rules as formatTokens directly', () => {
    const values = [0, 50, 999, 1000, 1500, 1_000_000];

    for (const v of values) {
      const [formattedFromTooltip] = usageTooltipFormatter(v);
      const formattedDirect = formatTokens(v);

      expect(formattedFromTooltip).toBe(formattedDirect);
    }
  });
});
