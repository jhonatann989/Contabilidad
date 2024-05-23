import { DataScheme } from "./GenericTypes";
import { List, Datagrid, TextField, DateField, BooleanField, NumberField } from 'react-admin';

export const GenericList = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <List>
        <Datagrid rowClick="show">
            {schema.map((item: DataScheme) => {
                if(item.isListable) {
                    switch(item.type) {
                        case "Text": return <TextField  source={item.source} label={item.label} />;
                        case "Number": return <NumberField source={item.source} label={item.label} />;
                        case "Date": return <DateField  source={item.source} label={item.label} />;
                        case "RichText": return <TextField  source={item.source} label={item.label} />;
                        case "Boolean": return <BooleanField  source={item.source} label={item.label} />;
                    }
                }
            })}
        </Datagrid>
    </List>
)
};

