import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Vista de juego',
		},
		{
			name: 'description',
			content: 'Vista de juego de Bad Ice Cream',
		},
	];
};