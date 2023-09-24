import { Redirect } from "react-router-dom";
import {useOktaAuth} from '@okta/okta-react';
import { SpinnerLoading } from "../Layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({config})=>{
    const {oktaAuth, authState}= useOktaAuth();
    const onSuccess=(tokens)=>{
        oktaAuth.handleLoginRedirect(tokens);
    }

    const onError = (err)=>{
        toast.error(`'Sign in error '${err}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
    }

    if(!authState){
        return <SpinnerLoading/>;
    }

    return authState.isAuthenticated?<Redirect to={{pathname: '/'}}/>: <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>
};

export default LoginWidget;