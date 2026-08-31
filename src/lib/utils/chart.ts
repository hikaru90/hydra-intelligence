export interface Sparkline {
	/** Smooth cubic path for the line stroke. */
	line: string;
	/** Same path closed to the baseline for the gradient fill. */
	area: string;
	/** Vertical padding used inside the 0–100 viewBox (also where gridlines sit). */
	pad: number;
}

/**
 * Build line + area paths for a value series inside a 100×100 viewBox
 * (rendered with preserveAspectRatio="none" so it stretches to any card size).
 */
export function buildSparkline(series: number[], pad = 8): Sparkline {
	if (series.length < 2) {
		return { line: '', area: '', pad };
	}
	const n = series.length;
	const min = Math.min(...series);
	const max = Math.max(...series);
	const range = max - min || 1;

	const pts = series.map((v, i) => ({
		x: (i / (n - 1)) * 100,
		y: pad + (1 - (v - min) / range) * (100 - 2 * pad)
	}));

	let line = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
	for (let i = 1; i < n; i++) {
		const cx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(2);
		line += ` C${cx},${pts[i - 1].y.toFixed(2)} ${cx},${pts[i].y.toFixed(2)} ${pts[i].x.toFixed(2)},${pts[i].y.toFixed(2)}`;
	}
	const area = `${line} L100,100 L0,100 Z`;
	return { line, area, pad };
}
