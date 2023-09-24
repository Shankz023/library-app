import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/messages/secure/add/message`;
    if (authState?.isAuthenticated && title !== "" && question !== "") {
      const messagesRequestModel = new MessageModel(title, question);
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagesRequestModel),
      };

      const submitNewQuestionResponse = await fetch(url, requestOptions);
      if (!submitNewQuestionResponse.ok) {
        throw new Error("Something went wrong!");
      }

      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }


  return (
    <div className="card mt-3">
      <div className="card-header">Ask question to Shankz Library Admin</div>
      <div className="card-body">
        <form method="post">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}
          {displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question added successfully
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextArea1"
              placeholder="Question"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            />
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={submitNewQuestion}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
