  import ErrorHandler from "../utils/errorHandler.js";

  export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Something went wrong!"
    
    res.status(err.statusCode)
      .json({
        error: err.message
      })
  }