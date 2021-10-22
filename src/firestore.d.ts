declare namespace Firestore {
	type FieldValue = import('firebase-admin').firestore.FieldValue
	type CreatedUpdatedWrite = {
		createdAt: FieldValue
		updatedAt: FieldValue
	}
	type CreatedUpdatedRead = {
		createdAt: Timestamp
		updatedAt: Timestamp
	}
	type CreatedUpdatedCompare = {
		createdAt: Date | Timestamp
		updatedAt: Date | Timestamp
	}

	type Timestamp = import('firebase-admin').firestore.Timestamp

	type Compare = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
	type ArrayCompare = 'array-contains' | 'in' | 'array-contains-any'
}
