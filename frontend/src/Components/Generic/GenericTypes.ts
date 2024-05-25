export type FieldType = "Text"|"Number"|"Date"|"RichText"|"Boolean"

export type FieldTypeWithReference = {
    type:FieldType,
    property: string,
    reference: string
}

export type DataScheme = {
    source: string,
    label: string,
    type: FieldType|FieldTypeWithReference,
    isListable: boolean,
    isEditable: boolean,
    isCreatable: boolean
}