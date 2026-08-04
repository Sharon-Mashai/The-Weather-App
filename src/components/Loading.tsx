interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading weather..." }: LoadingProps) {
  return (
    <div className="loadingState">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
