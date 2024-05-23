export type FieldType = "Text"|"Number"|"Date"|"RichText"|"Boolean"

export type DataScheme = {
    source: string,
    label: string,
    type: FieldType,
    isListable: boolean,
    isEditable: boolean,
    isCreatable: boolean
}