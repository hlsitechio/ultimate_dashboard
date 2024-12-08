import { Spinner } from "@nextui-org/react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner = ({ fullScreen }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spinner color="primary" />
    </div>
  );
};

export default LoadingSpinner;