export const extractErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object'
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          detail?: string | { error?: string };
          error?: string;
        };
      };
    };

    const detail = axiosError.response?.data?.detail;
    const flatError = axiosError.response?.data?.error;

    if (typeof detail === 'string') {
      return detail;
    }

    if (typeof detail === 'object' && detail?.error) {
      return detail.error;
    }

    if (typeof flatError === 'string') {
      return flatError;
    }

    return 'Unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};
