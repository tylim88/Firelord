import { Timestamp } from './alias'
import { MetaType } from './metaTypeCreator'
import { StrictPick } from './utils'

declare const JSONServerTimestampSymbol: unique symbol
declare const JSONTimestampSymbol: unique symbol
declare const JSONDateSymbol: unique symbol
declare const JSONGeoPointSymbol: unique symbol
declare const JSONDocumentReferenceSymbol: unique symbol

type JSONServerTimestampSymbol = typeof JSONServerTimestampSymbol
type JSONTimestampSymbol = typeof JSONTimestampSymbol
type JSONDateSymbol = typeof JSONDateSymbol
type JSONGeoPointSymbol = typeof JSONGeoPointSymbol
type JSONDocumentReferenceSymbol = typeof JSONDocumentReferenceSymbol

export declare class JSON<T> {
	protected Firelord_JSON: T
}

export interface JSONServerTimestamp extends JSON<JSONServerTimestampSymbol> {}

export interface JSONDate extends JSON<JSONDateSymbol> {}

// TODO need experiment
export interface JSONTimestamp
	extends StrictPick<Timestamp, 'nanoseconds' | 'seconds'>,
		JSON<JSONTimestampSymbol> {}
// TODO need experiment
export interface JSONGeoPoint extends JSON<JSONGeoPointSymbol> {
	latitude: number
	longitude: number
}
// TODO need experiment
export interface JSONDocumentReference<T extends MetaType>
	extends JSON<JSONDocumentReferenceSymbol> {}
