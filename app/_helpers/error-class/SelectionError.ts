export class SelectionError extends Error {
    cause: string;
    constructor(message: string, cause: string) {
      super(message);
        this.name = "SelectionError";
        this.cause = cause;
    }
  }
  