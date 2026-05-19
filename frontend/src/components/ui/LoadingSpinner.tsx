interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  message = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-gray-600 dark:border-t-primary-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};
