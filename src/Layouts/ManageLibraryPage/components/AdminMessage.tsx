import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../models/MessageModel";
import { useState } from "react";

export const AdminMessage: React.FC<{ message: MessageModel,submitResponseHandler:any }> = (
  props,
  key
) => {
  const { authState } = useOktaAuth();

  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");

  function submitBtn(){
    if(props.message.id !==null && response !== ''){
        props.submitResponseHandler(props.message.id, response);
        setDisplayWarning(false);
    }else{
        setDisplayWarning(true);
    }
  }

  return (
    <>
      <div>
        <div className="card mt-2 shadow p-3 bg-body rounded">
          <div>
          <h5>
            Case #{props.message.id}: {props.message.title}
          </h5>
          <h6>{props.message.userEmail}</h6>
          <p>{props.message.question}</p>
          <hr />
          </div>
        <h5>Response: </h5>
        <form action="PUT">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out.
            </div>
          )}
          <div className="colmd-12 mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} onChange={e => setResponse(e.target.value)} value={response}></textarea>
          </div>
          <div>
            <button onClick={submitBtn} type="button" className="btn btn-primary mt-3">Submit Response</button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};
