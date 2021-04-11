const app = new Vue({
  el: "#app",
  data: {
    url: "",
    slug: "",
    error: "",
    formVisible: true,
    created: null,
  },
  methods: {
    async createUrl() {
      this.error = "";
      const response = await fetch("/new", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
          slug: this.slug,
        }),
      });
      if (response.ok && response.status === 200) {
        const data = await response.json();
        this.formVisible = false;
        this.created = `https://hshort.me/${data.result.slug}`;
      } else {
        const data = await response.json();
        this.error = data.message;
      }
    },
  },
});
