import { MetaTypeCreator } from 'firelord'

export type Parent = MetaTypeCreator<
	{
		a: number
	},
	'IAmParent',
	string
>

export type Child = MetaTypeCreator<
	{
		b: string
	},
	'IAmChild',
	string,
	Parent
>
