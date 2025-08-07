export interface SubscriberError {
  error: string;
  details?: {
    existingEmail: string;
    status: string;
  };
}

export const parseSubscriberError = async (response: Response): Promise<SubscriberError> => {
  const errorText = await response.text();
  
  try {
    const errorJson = JSON.parse(errorText);
    return errorJson;
  } catch {
    return {
      error: 'Failed to add subscriber'
    };
  }
};

export const handleSubscriberExistsError = (error: SubscriberError): string => {
  if (error.error === 'Subscriber already exists' && error.details) {
    return `Subscriber ${error.details.existingEmail} already exists (Status: ${error.details.status})`;
  }
  return error.error || 'Failed to add subscriber';
};

export const isSubscriberExistsError = (error: SubscriberError): boolean => {
  return error.error === 'Subscriber already exists';
};

export const createNetworkError = (error: unknown): string => {
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
  return 'Network error occurred';
};
