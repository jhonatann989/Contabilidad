import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";


export const App = () => {

  interface Permission {
    module: string,
    Create: boolean,
    Read: boolean,
    Update: boolean,
    Delete: boolean
  }

  let stringPermissions = localStorage.getItem('permissions')
  let permissions:[] = stringPermissions? JSON.parse(stringPermissions) : []

  return (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {permissions.map((permission:Permission) => <Resource
      name={permission.module}
      list={permission.Read? ListGuesser : undefined}
      show={permission.Read? ShowGuesser: undefined}
      edit={permission.Update? EditGuesser : undefined}
    />)}
    
  </Admin>
)
}
  
  ;
