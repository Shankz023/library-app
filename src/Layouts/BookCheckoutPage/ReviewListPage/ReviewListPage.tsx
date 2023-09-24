import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPage, setTotalPages] = useState(0);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${import.meta.env.VITE_API_BASE_URL}/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${reviewsPerPage}`;

      const response = await fetch(reviewUrl);
      if (!response.ok) {
        throw new Error("Some things went wrong!");
      }

      const responseJson = await response.json();
      const responseData = responseJson._embedded.reviews;

      setTotalAmountOfReviews(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loadedReview: ReviewModel[] = [];

      for (const key in responseData) {
        loadedReview.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          bookId: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
      }

      setReviews(loadedReview);
      setIsLoading(false);
    };
    fetchBookReviews().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  let paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-6">
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>{indexOfFirstReview+1} to {lastItem} of {totalAmountOfReviews} items: </p>
      <div className="row">
        {reviews.map(review =>(
            <Review review={review} key={review.id}/>
        ))}
      </div>
      {totalPage > 1 && <Pagination currentPage={currentPage} totalPages={totalPage} paginate={paginate}/> }
    </div>
  );
};
