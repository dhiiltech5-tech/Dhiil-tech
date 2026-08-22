export function successResponse(data = null, message = 'Success', code = 200) {
  return {
    code,
    response: {
      success: true,
      message,
      data
    }
  };
}

export function errorResponse(message = 'Error', code = 400) {
  return {
    code,
    response: {
      success: false,
      message
    }
  };
}
