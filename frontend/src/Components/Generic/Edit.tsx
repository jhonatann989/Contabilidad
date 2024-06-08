import { DataScheme } from "./GenericTypes";
import { Edit, SimpleForm, TextInput, DateInput, NumberInput, NullableBooleanInput, ReferenceInput, SelectInput } from 'react-admin';

export const GenericEdit = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Edit>
        <SimpleForm>
            {schema.map((item: DataScheme) => {
                
                if(typeof item.type == "string") {
                    switch(item.type) {
                        case "Text": return <TextInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable}/>;
                        case "Number": return <NumberInput source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                        case "Date": return <DateInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                        case "RichText": return <TextInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} multiline={true} />;
                        case "Boolean": return <NullableBooleanInput  source={item.source} label={item.label} required={item.isEditable} disabled={!item.isEditable} />;
                    }
                } else if(typeof item.type == "object") {

                    return <ReferenceInput source={item.source} reference={item.type.reference} link={false} >
                                <SelectInput label={item.label} optionText={item.type.property} InputProps={{required: item.isEditable, disabled: !item.isEditable}} />
                            </ReferenceInput>;
                }
            })}
        </SimpleForm>
    </Edit>
)
};

