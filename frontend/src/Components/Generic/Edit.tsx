import { DataScheme } from "./GenericTypes";
import { Edit, SimpleForm, TextInput, DateInput, TextField, DateField, EditButton, required, NumberInput, BooleanInput } from 'react-admin';

export const GenericEdit = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Edit>
        <SimpleForm>
            {schema.map((item: DataScheme) => {
                if(item.isEditable) {
                    switch(item.type) {
                        case "Text": return <TextInput  source={item.source} label={item.label} required />;
                        case "Number": return <NumberInput source={item.source} label={item.label} required />;
                        case "Date": return <DateInput  source={item.source} label={item.label} required />;
                        case "RichText": return <TextInput  source={item.source} label={item.label} required multiline={true} />;
                        case "Boolean": return <BooleanInput  source={item.source} label={item.label} />;
                    }
                }
            })}
        </SimpleForm>
    </Edit>
)
};

