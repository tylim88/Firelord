import { Timestamp } from './alias'
import { MetaType } from './metaTypeCreator'
import { StrictPick } from './utils'

declare const JSONTimestampSymbol: unique symbol
declare const JSONGeoPointSymbol: unique symbol
declare const JSONDocumentReferenceSymbol: unique symbol

type JSONTimestampSymbol = typeof JSONTimestampSymbol
type JSONGeoPointSymbol = typeof JSONGeoPointSymbol
type JSONDocumentReferenceSymbol = typeof JSONDocumentReferenceSymbol

export declare class JSON<T> {
	protected Firelord_JSON_Do_Not_Access?: T
}

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
