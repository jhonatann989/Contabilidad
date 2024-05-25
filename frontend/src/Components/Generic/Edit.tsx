import { DataScheme } from "./GenericTypes";
import { Edit, SimpleForm, TextInput, DateInput, TextField, DateField, EditButton, required, NumberInput, BooleanInput } from 'react-admin';

export const GenericEdit = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Edit>
        <SimpleForm>
            {schema.map((item: DataScheme) => {
                switch(item.type) {
                    case "Text": return <TextInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable}/>;
                    case "Number": return <NumberInput source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                    case "Date": return <DateInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                    case "RichText": return <TextInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} multiline={true} />;
                    case "Boolean": return <BooleanInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                }
            })}
        </SimpleForm>
    </Edit>
)
};

