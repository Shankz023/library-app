import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";
import { toast } from "react-toastify";

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  // New Book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [description, setDescription] = useState("");

  // Displays
  const [displayWarning, setDispalyWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  async function base64ConversionOfImage(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage(reader.result);
    };
    reader.onerror = function (error) {
      toast.error(`${error}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    };
  }

  async function submitNewBook() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/secure/add/book`;
    if (
      authState?.isAuthenticated &&
      title !== "" &&
      author !== "" &&
      category !== "" &&
      description !== "" &&
      copies >= 0
    ) {
      const book: AddBookRequest = new AddBookRequest(
        title,
        author,
        description,
        copies,
        category
      );
      book.img = selectedImage;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      };

      const submitNewBookResponse = await fetch(url, requestOptions);
      if (!submitNewBookResponse.ok) {
        throw new Error("Something went wrong");
      }
      setTitle("");
      setDescription("");
      setAuthor("");
      setCopies(0);
      setCategory("Category");
      setSelectedImage(null);
      setDispalyWarning(false);
      setDisplaySuccess(true);

      toast.success("Successfully Added Book", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setDispalyWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <>
      <div className="container mt-5 mb-5">
        {displaySuccess && (
          <div className="alert alert-success" role="alert">
            Book added successfully
          </div>
        )}
        {displayWarning && (
          <div className="alert alert-danger" role="alert">
            All fields must be filled out
          </div>
        )}
        <div className="card">
          <div className="card-header">Add a new book</div>
          <div className="card-body">
            <form method="post">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    value={title}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    required
                    onChange={(e) => setAuthor(e.target.value)}
                    className="form-control"
                    value={author}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Category</label>
                  <button
                    name="author"
                    className="form-control btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {category}
                  </button>
                  <ul
                    className="dropdown-menu"
                    id="addNewBookId"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a
                        onClick={() => categoryField("FE")}
                        className="dropdown-item"
                      >
                        Front End
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => categoryField("BE")}
                        className="dropdown-item"
                      >
                        Back End
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => categoryField("Data")}
                        className="dropdown-item"
                      >
                        Data
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => categoryField("DevOps")}
                        className="dropdown-item"
                      >
                        DevOps
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    id="exampleFormControlTextarea1"
                    rows={3}
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Copies</label>
                  <input
                    type="number"
                    name="Copies"
                    required
                    className="form-control"
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                  />
                </div>
                <input
                  type="file"
                  onChange={(e) => base64ConversionOfImage(e)}
                />
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={submitNewBook}
                  >
                    Add Book
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
