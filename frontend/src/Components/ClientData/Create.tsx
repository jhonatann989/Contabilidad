import { SimpleForm, TextInput, NumberInput, SelectInput, Create, ArrayInput, SimpleFormIterator } from 'react-admin';
import { IdTypeChoices } from './Commons';

export const CreateUserData = (props: any) => {
    return (
    <Create>
        <SimpleForm>
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
