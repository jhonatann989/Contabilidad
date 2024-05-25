import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { GenericShow } from "./Components/Generic/Show";
import { DataScheme } from "./Components/Generic/GenericTypes";
import { GenericEdit } from "./Components/Generic/Edit";
import { GenericList } from "./Components/Generic/List";


export const App = () => {

  type Permission = {
    module: string,
    Create: boolean,
    Read: boolean,
    Update: boolean,
    Delete: boolean
  }
  type ResourceSchemes = {
    [key:string]: DataScheme[]
  }

  let stringPermissions = localStorage.getItem('permissions')
  let permissions:[] = stringPermissions? JSON.parse(stringPermissions) : []

  let schemes:ResourceSchemes = {
    Client: [
      { source: "username", label: "Username", type: "Text", isListable: true ,isEditable: false, isCreatable: true},
      { source: "idNumber", label: "ID Number", type: "Number", isListable: false ,isEditable: true, isCreatable: true},
      { source: "idType", label: "ID Type", type: "Text", isListable: false ,isEditable: true, isCreatable: true},
      { source: "fullName", label: "Full name", type: "Text", isListable: true ,isEditable: true, isCreatable: true},
      { source: "address", label: "Address", type: "RichText", isListable: false ,isEditable: true, isCreatable: true},
      { source: "createdAt", label: "Created At", type: "Date", isListable: false ,isEditable: false, isCreatable: false},
      { source: "updatedAt", label: "Updated At", type: "Date", isListable: false ,isEditable: false, isCreatable: false},
    ],
    UserPermission: [
      { source: "ClientId", label: "Client ID", type: {type: "Text", property:"fullName", reference: "Client"}, isListable: true ,isEditable: true, isCreatable: true},
      { source: "module", label: "Module", type: "Text", isListable: true ,isEditable: true, isCreatable: true},
      { source: "Create", label: "Can Create?", type: "Boolean", isListable: true ,isEditable: true, isCreatable: true},
      { source: "Read", label: "Can Read?", type: "Boolean", isListable: false ,isEditable: true, isCreatable: true},
      { source: "Update", label: "Can Update", type: "Boolean", isListable: false ,isEditable: true, isCreatable: true},
      { source: "Delete", label: "Can Delete?", type: "Boolean", isListable: false ,isEditable: true, isCreatable: true},
    ]
  }

  return (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {permissions.map((permission:Permission) => <Resource
      name={permission.module}
      list={permission.Read? <GenericList schema={schemes[permission.module]} /> : undefined}
      show={permission.Read? <GenericShow schema={schemes[permission.module]}/>: undefined}
      edit={permission.Update? <GenericEdit schema={schemes[permission.module]} /> : undefined}
    />)}
    
  </Admin>
)
}
  
  ;
