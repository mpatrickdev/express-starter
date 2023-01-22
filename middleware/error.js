  import ErrorHandler from "../utils/errorHandler.js";

  export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Something went wrong!"
    console.log(err.stack)

    // wrong mongo id error
    if(err.name === "CastError"){
      const message = `Resource not found ${err.path}`
      err = new ErrorHandler(message, 400)
    }

    // Duplicate key error (mongo)
    if(err.code == 11000){ 
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`
      err = new ErrorHandler(message, 400)
    }

    // wrong jwt error
    if(err.name == "jsonWebTokenError"){ 
      const message = `Invalid token please try again`
      err = new ErrorHandler(message, 400)
    }

    // expired jwt error
    if(err.name == "TokenExpiredError"){ 
      const message = `Expired token please try again`
      err = new ErrorHandler(message, 400)
    }

    


    res.status(err.statusCode)
      .json({
        success: false,
        error: err.message,
        // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
      })
  }