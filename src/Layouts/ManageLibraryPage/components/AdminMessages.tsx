import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import { Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  //Normal Loading Pieces
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Messages endpoint State
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagePerPage] = useState(5);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //Recall useEffect
  const [btnSubmit, setBtnSubmit] = useState(false);


  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${import.meta.env.VITE_API_BASE_URL}/messages/search/findByClosed/?closed=false&page=${
          currentPage - 1
        }&size=${messagePerPage}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const messageResponse = await fetch(url, requestOptions);

        if (!messageResponse.ok) {
          throw new Error("Something went wrong");
        }
        const messagesResponseJson = await messageResponse.json();

        setMessages(messagesResponseJson._embedded.messages);
        setTotalPages(messagesResponseJson.page.totalPages);

        setIsLoadingMessages(false);
      }
    };
    fetchUserMessages().catch((error: any) => {
      setIsLoadingMessages(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, btnSubmit]);

  if (isLoadingMessages) {
    return (
      <>
        <SpinnerLoading />
      </>
    );
  }

  if (httpError) {
    return (
      <>
        <div className="container m-5">
          <p>{httpError}</p>
        </div>
      </>
    );
  }

  async function submitResponseToQuestion(id: number, response: string) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/messages/secure/admin/message`;
    if (
      authState &&
      authState?.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const messageAdminRequestModel: AdminMessageRequest =
        new AdminMessageRequest(id, response);
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageAdminRequestModel),
      };

      const messageAdminRequestModelResponse = await fetch(url, requestOptions);
      if (!messageAdminRequestModelResponse.ok) {
        throw new Error("Something went wrong!");
      }
      setBtnSubmit(!btnSubmit);
      toast.success('Successfully responed', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="mt-3">
        {messages.length > 0 ? (
          <>
            <h5>Pending Q/A: </h5>
            {messages.map((message) => (
              <AdminMessage
                message={message}
                key={message.id}
                submitResponseHandler={submitResponseToQuestion}
              />
            ))}
          </>
        ) : (
          <>
            <h5>No Pending Q/A</h5>
          </>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </>
  );
};
