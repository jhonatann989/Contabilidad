import { DataScheme } from "./GenericTypes";
import { SimpleForm, TextInput, DateInput, NullableBooleanInput, NumberInput, ReferenceInput, SelectInput, Create } from 'react-admin';

export const GenericCreate = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Create>
        <SimpleForm>
            {schema.map((item: DataScheme) => {
                if(item.isCreatable) {
                    if(typeof item.type == "string") {
                        switch(item.type) {
                            case "Text": return <TextInput  source={item.source} label={item.label} required/>;
                            case "Number": return <NumberInput source={item.source} label={item.label} required />;
                            case "Date": return <DateInput  source={item.source} label={item.label} required />;
                            case "RichText": return <TextInput  source={item.source} label={item.label} required multiline={true} />;
                            case "Boolean": return <NullableBooleanInput  source={item.source} label={item.label} required />;
                        }
                    } else if(typeof item.type == "object") {
    
                        return <ReferenceInput source={item.source} reference={item.type.reference} link={false} >
                                    <SelectInput label={item.label} optionText={item.type.property} InputProps={{required: true }} />
                                </ReferenceInput>;
                    }
                }
            })}
        </SimpleForm>
    </Create>
)
};

