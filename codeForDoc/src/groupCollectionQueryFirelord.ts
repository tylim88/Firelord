import { MetaTypeCreator, getFirelord, query, where } from 'firelord'

const firelord = getFirelord()

type abc = MetaTypeCreator<
	{
		a: { b: number; c: number }
		d: number
	},
	'abc',
	string
>
