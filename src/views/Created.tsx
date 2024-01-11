export const Created = ({ url }: { url: string }) => {
  return (
    <div class="success-created">
      <p class="reminder">
        Please remember this slug, you can't see this anymore if you close this
      </p>
      <p class="created">
        Your short url is: <br />
        <a href={url} title="Shortened url">
          {url}
        </a>
      </p>
    </div>
  );
};
