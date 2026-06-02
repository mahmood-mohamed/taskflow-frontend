import { toast } from "react-hot-toast";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

interface BackendErrorResponse {
  success: boolean;
  message: string;
  errorDetails?: string[];
  code?: string;
}

/**
 * Handles backend errors, specifically mapping validation errors to react-hook-form
 */
export const handleBackendError = <T extends FieldValues>(
  error: any,
  setError?: UseFormSetError<T>
) => {
  const errorData = error.response?.data as BackendErrorResponse;
  const message = errorData?.message || "Something went wrong";
  const details = errorData?.errorDetails;

  // 1. Handle Validation Errors (Joi or Mongoose)
  const isValidationError = message === "Validation error" || message.toLowerCase().includes("validation failed");
  
  if (isValidationError) {
    let hasMappedToField = false;

    // Joi usually sends errorDetails array, Mongoose usually puts it in the message
    const errorList = details || (message.includes(":") ? [message] : []);

    errorList.forEach((detail) => {
      // 1.1 Handle Joi format: "field" must be...
      const joiMatch = detail.match(/"([^"]+)"/);
      // 1.2 Handle Mongoose format: field: message
      const mongooseMatch = detail.match(/(\w+):\s+(.+)/);

      const fieldName = joiMatch ? joiMatch[1] : (mongooseMatch ? mongooseMatch[1] : null);
      let cleanMessage = joiMatch ? detail.replace(/"[^"]+"\s*/, "").trim() : (mongooseMatch ? mongooseMatch[2] : detail);
      
      if (fieldName && setError) {
        // Map common technical messages to user-friendly ones
        if (cleanMessage.includes("must be in ISO 8601 date format")) {
          cleanMessage = "Invalid date format";
        }
        if (cleanMessage.includes("must be a valid date")) {
          cleanMessage = "Please enter a valid date";
        }
        
        setError(fieldName as Path<T>, {
          type: "manual",
          message: cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1),
        });
        hasMappedToField = true;
      } else {
        // Fallback to toast if no field name found or no setError provided
        toast.error(detail);
      }
    });

    // If we didn't map any specific fields, show the generic message
    if (!hasMappedToField) {
      toast.error(message);
    }
    return;
  }

  // 2. Handle specific error codes if needed
  if (errorData?.code === "TOKEN_EXPIRED") {
    // This is usually handled by axios interceptors, but just in case
    toast.error("Session expired. Please login again.");
    return;
  }

  // 3. Fallback: Show the main error message in a toast
  toast.error(message);
};
