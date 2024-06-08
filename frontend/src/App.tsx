import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { GenericShow } from "./Components/Generic/Show";
import { DataScheme } from "./Components/Generic/GenericTypes";
import { GenericEdit } from "./Components/Generic/Edit";
import { GenericList } from "./Components/Generic/List";
import { GenericCreate } from "./Components/Generic/Create";
import { CreateUserData } from "./Components/ClientData/Create";


export const App = () => {

  type Permission = {
    module: string,
    Create: boolean,
    Read: boolean,
    Update: boolean,
    Delete: boolean
  }
  type ResourceSchemes = { [key:string]: DataScheme[] }

  let stringPermissions = localStorage.getItem('permissions')
  let permissions:[] = stringPermissions? JSON.parse(stringPermissions) : []

  let schemes:ResourceSchemes = {
    Client: [
      { source: "username", label: "Username", type: "Text", isListable: true ,isViewable: true ,isEditable: false, isCreatable: true},
      { source: "password", label: "Password", type: "Text", isListable: false ,isViewable: false ,isEditable: true, isCreatable: true},
      { source: "createdAt", label: "Created At", type: "Date", isListable: false ,isViewable: true ,isEditable: false, isCreatable: false},
      { source: "updatedAt", label: "Updated At", type: "Date", isListable: false ,isViewable: true ,isEditable: false, isCreatable: false},
    ],
    UserPermission: [
      { source: "ClientId", label: "Client ID", type: {type: "Text", property:"username", reference: "Client"}, isListable: true ,isViewable: true ,isEditable: false, isCreatable: true},
      { source: "module", label: "Module", type: "Text", isListable: true ,isViewable: true ,isEditable: false, isCreatable: true},
      { source: "Create", label: "Can Create?", type: "Boolean", isListable: false ,isViewable: true ,isEditable: true, isCreatable: true},
      { source: "Read", label: "Can Read?", type: "Boolean", isListable: false ,isViewable: true ,isEditable: true, isCreatable: true},
      { source: "Update", label: "Can Update", type: "Boolean", isListable: false ,isViewable: true ,isEditable: true, isCreatable: true},
      { source: "Delete", label: "Can Delete?", type: "Boolean", isListable: false ,isViewable: true ,isEditable: true, isCreatable: true},
    ]
  }

  function getModule(permission:Permission, moduleName:string) {
    switch(moduleName){
      case "ClientData":
        let clientFields: DataScheme[] = [
          { source: "idType", label: "ID Type", type: "Text", isListable: true ,isViewable: true ,isEditable: true, isCreatable: true},
          { source: "idNumber", label: "ID Number", type: "Number", isListable: true ,isViewable: true ,isEditable: true, isCreatable: true},
          { source: "fullName", label: "Full name", type: "Text", isListable: true ,isViewable: true ,isEditable: true, isCreatable: true},
          { source: "address", label: "Address", type: "RichText", isListable: false ,isViewable: true ,isEditable: true, isCreatable: true},
          { source: "createdAt", label: "Created At", type: "Date", isListable: false ,isViewable: true ,isEditable: false, isCreatable: false},
          { source: "updatedAt", label: "Updated At", type: "Date", isListable: false ,isViewable: true ,isEditable: false, isCreatable: false},
        ]
        return <Resource
          name={permission.module}
          create={permission.Create? <CreateUserData /> : undefined}
          list={permission.Read? <GenericList schema={clientFields} /> : undefined}
          show={permission.Read? <GenericShow schema={clientFields}/>: undefined}
          edit={permission.Update? <GenericEdit schema={clientFields} /> : undefined}
        />
      default:
        return <Resource
          name={permission.module}
          create={permission.Create? <GenericCreate schema={schemes[permission.module]} /> : undefined}
          list={permission.Read? <GenericList schema={schemes[permission.module]} /> : undefined}
          show={permission.Read? <GenericShow schema={schemes[permission.module]}/>: undefined}
          edit={permission.Update? <GenericEdit schema={schemes[permission.module]} /> : undefined}
        />
    }
  }

  return (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {permissions.map((permission:Permission) => getModule(permission, permission.module))}
  </Admin>
)
}
  
  ;
