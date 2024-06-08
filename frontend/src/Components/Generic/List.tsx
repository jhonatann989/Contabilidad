import { DataScheme } from "./GenericTypes";
import { List, Datagrid, TextField, DateField, BooleanField, NumberField, RichTextField, ReferenceField } from 'react-admin';

export const GenericList = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <List>
        <Datagrid rowClick="show">
            {schema.map((item: DataScheme) => {
                if(item.isListable) {
                    if(typeof item.type == "string") {
                        switch(item.type) {
                            case "Text": return <TextField source={item.source} label={item.label} />;
                            case "Number": return <NumberField source={item.source} label={item.label} />;
                            case "Date": return <DateField source={item.source} label={item.label} />;
                            case "RichText": return <RichTextField source={item.source} label={item.label} />;
                            case "Boolean": return <BooleanField  source={item.source} label={item.label} />;
                        }
                    } else if(typeof item.type == "object") {
    
                        const getField = (fieldType:string, property:string) => {
                            switch(fieldType) {
                                case "Text": return <TextField source={property}/>;
                                case "Number": return <NumberField source={property} />;
                                case "Date": return <DateField source={property} />;
                                case "RichText": return <RichTextField source={property} />;
                                case "Boolean": return <BooleanField source={property} />;
                            }
                        }
    
                        return <ReferenceField source={item.source} reference={item.type.reference} label={item.label} link={false} >
                                    {getField(item.type.type, item.type.property)}
                                </ReferenceField>;
                    }
                }
            })}
        </Datagrid>
    </List>
)
};

