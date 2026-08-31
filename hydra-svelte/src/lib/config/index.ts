import type { BuoyStatus, DeploymentType, ParameterDef } from '$lib/types';

// Fixed order, colours and units. The order and colours are part of the product
// contract (identical colours across buoys so the *values* carry the comparison).
// Precision here is display-only — export keeps full precision.
export const PARAMETERS: ParameterDef[] = [
	{ id: 'waterTemp', label: 'Water Temperature', unit: '°C', color: '#FFFFFF' },
	{ id: 'dissolvedOxygen', label: 'Dissolved Oxygen', unit: 'mg/l', color: '#FFB6ED' },
	{ id: 'tds', label: 'Total Dissolved Solids', unit: 'μS/cm', color: '#FFAA8E' },
	{ id: 'redox', label: 'Redox Potential', unit: 'mV', color: '#B0ADFF' },
	{ id: 'lightAbove', label: 'Light Above Water', unit: 'lx', color: '#FBFFAA' },
	{ id: 'lightBelow', label: 'Light Below Water', unit: 'lx', color: '#A9E3F4' }
];

// Traffic-light colours. Orange is reserved for genuine attention states only.
export const STATUS_COLOR: Record<BuoyStatus, string> = {
	ok: '#15e49a',
	mid: '#FBFFAA',
	warn: '#FD7A4E'
};

// Lower-case status text shown on cards. 'mid' still reads as online.
export const STATUS_TEXT: Record<BuoyStatus, string> = {
	ok: 'online',
	mid: 'online',
	warn: 'needs attention'
};

// Short label used on a card when no free-text subject is set.
export const DEPLOYMENT_LABEL: Record<DeploymentType, string> = {
	seaweed: 'Seaweed',
	shellfish: 'Shellfish',
	fish: 'Fish farm',
	restoration: 'Restoration',
	research: 'Research',
	other: 'Buoy'
};

// Adaptive copy for the "subject" field in the add-buoy sheet, keyed by deployment.
export const SUBJECT_COPY: Record<
	DeploymentType,
	{ label: string; hint: string; placeholder: string }
> = {
	seaweed: {
		label: "What's being cultivated",
		hint: 'Optional — species grown here',
		placeholder: 'e.g. Saccharina latissima'
	},
	shellfish: {
		label: "What's being farmed",
		hint: 'Optional — species farmed here',
		placeholder: 'e.g. Blue mussel'
	},
	fish: {
		label: "What's being farmed",
		hint: 'Optional — species farmed here',
		placeholder: 'e.g. Atlantic salmon'
	},
	restoration: {
		label: "What's being restored",
		hint: 'Optional — species or habitat',
		placeholder: 'e.g. Eelgrass'
	},
	research: {
		label: "What's being studied",
		hint: 'Optional — subject or leave blank',
		placeholder: 'e.g. open water'
	},
	other: { label: 'Subject', hint: 'Optional', placeholder: '' }
};

export const TIME_RANGE_LABEL = {
	now: 'now',
	'24h': '24h',
	'7d': '7d',
	'30d': '30d'
} as const;
