import { ZodError } from "zod";

interface ServerActionData<T> {
  status: "success";
  data: {
    message: string;
  } & T;
}

interface ServerActionMessage {
  status: "success";
  data: {
    message: string;
  };
}

interface ServerActionError {
  status: "error";
  errors: {
    message: string;
  }[];
}

export function sendData<T>(data: T): ServerActionData<T> {
  return {
    status: "success",
    data: {
      message: "Operación exitosa",
      ...data,
    },
  };
}

export function sendMessage(message: string): ServerActionMessage {
  return {
    status: "success",
    data: {
      message,
    },
  };
}

export function sendError(error: any): ServerActionError {
  if (error instanceof ZodError) {
    return {
      status: "error",
      errors: error.issues,
    };
  } else if (typeof error === "string") {
    return {
      status: "error",
      errors: [
        {
          message: error,
        },
      ],
    };
  }
  return {
    status: "error",
    errors: [
      {
        message: "Error desconocido",
      },
    ],
  };
}