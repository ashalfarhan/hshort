export const Created = ({ url }: { url: string }) => {
  return (
    <div class="success-created">
      <p class="created">
        Your short url is:&nbsp;
        <a href={url} title="Shortened url">
          {url}
        </a>
      </p>
    </div>
  );
};
