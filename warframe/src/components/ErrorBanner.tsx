interface ErrorBannerProps {
  messages: string[];
}

export function ErrorBanner({ messages }: ErrorBannerProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-danger/50 bg-danger/10 p-3 text-sm text-red-100">
      <p className="font-semibold">Some data failed to load:</p>
      <ul className="ml-4 list-disc">
        {messages.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
