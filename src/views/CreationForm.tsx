export const CreationForm = ({
  error,
  slug,
  url,
}: {
  error?: string;
  slug?: string;
  url?: string;
}) => {
  return (
    <form class="form" method="POST" action="/new">
      {error ? (
        <div x-if="error" class="error">
          {error}
        </div>
      ) : null}
      <input
        class="input"
        type="url"
        name="url"
        placeholder="enter a url"
        value={url}
        required
      />
      <input
        class="input"
        type="text"
        name="slug"
        placeholder="enter a slug"
        value={slug}
      />
      <button type="submit" class="create">
        create
      </button>
    </form>
  );
};
