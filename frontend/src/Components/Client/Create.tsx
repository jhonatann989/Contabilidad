import { SimpleForm, TextInput, NumberInput, SelectInput, Create, ArrayInput, SimpleFormIterator } from 'react-admin';
import { IdTypeChoices } from './Commons';

export const GenericCreate = (props: any) => {
    return (
    <Create>
        <SimpleForm>
            <TextInput source='username'  required />
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
    </Create>
)
};
