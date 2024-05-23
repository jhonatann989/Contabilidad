import { DataScheme } from "./GenericTypes";
import { Edit, SimpleForm, TextInput, DateInput, BooleanInput, NumberInput } from 'react-admin';

export const GenericCreate = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Edit>
        <SimpleForm>
            {schema.map((item: DataScheme) => {
                if(item.isCreatable) {
                    switch(item.type) {
                        case "Text": return <TextInput  source={item.source} label={item.label} required />;
                        case "Number": return <NumberInput source={item.source} label={item.label} required />;
                        case "Date": return <DateInput  source={item.source} label={item.label} required />;
                        case "RichText": return <TextInput  source={item.source} label={item.label} required multiline={true} />;
                        case "Boolean": return <BooleanInput  source={item.source} label={item.label} required />;
                    }
                }
            })}
        </SimpleForm>
    </Edit>
)
};

