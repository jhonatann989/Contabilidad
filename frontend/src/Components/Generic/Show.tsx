import { Show,SimpleShowLayout, TextField, DateField, NumberField, RichTextField, BooleanField } from "react-admin";
import { DataScheme } from "./GenericTypes";


export const GenericShow = (props: any) => {
    let schema:DataScheme[] = Array.isArray(props.schema)? props.schema : []
    return (
    <Show>
        <SimpleShowLayout>
            {schema.map((item: DataScheme) => {
                switch(item.type) {
                    case "Text": return <TextField source={item.source} label={item.label} />;
                    case "Number": return <NumberField source={item.source} label={item.label} />;
                    case "Date": return <DateField source={item.source} label={item.label} />;
                    case "RichText": return <RichTextField source={item.source} label={item.label} />;
                    case "Boolean": return <BooleanField  source={item.source} label={item.label} />;
                }
            })}
        </SimpleShowLayout>
    </Show>
)
};

