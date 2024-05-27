import { IdTypeChoices } from "./Commons";
import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator } from 'react-admin';

export const GenericEdit = (props: any) => {
    return (
    <Edit>
        <SimpleForm>
            <TextInput source='username'  required disabled/>
            <NumberInput source='idNumber' required />
            <SelectInput source='idType' required choices={IdTypeChoices} />
            <TextInput source='fullName' required />
            <TextInput source='address' required multiline={true}/>
            <ArrayInput source='SocialMediaInfos' >
                <SimpleFormIterator>
                    <TextInput source='name' />
                    <TextInput source='account' />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
)
};

