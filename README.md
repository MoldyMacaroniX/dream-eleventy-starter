# `dream-eleventy-starter`

> Live Demo &nbsp; | &nbsp; [Documentation](#documentation) &nbsp; | &nbsp; [How-To](#how-to)

An Eleventy starter template. I do not recommend using this for a serious project (I will explain why below). I just wanted an Eleventy starter that had the following.

- Blog posts with a paginated archive page, which shows all posts paginated.
- Tags with paginated tag pages, which shows all posts with a tag paginated.
- Multiple authors with paginated author pages, which shows all posts by an author paginated.

Because Eleventy doesn't have nested pagination (which it really should) the simple demands above remained largely unmet in other themes (although I do appreciate the [vredeburg theme](https://github.com/dafiulh/vredeburg) for having nested pagination for its tag pages.)

Given this, I went ahead and mixed a bunch of code from the best themes, demos, and guides together and created this frankenstein theme.

<h1 id="table-of-contents">Table of Contents</h1>

- [Disclaimer](#disclaimer)
- [Features](#features)
- [Documentation](#documentation)
- [How-To](#how-to)
- [Credits](#credits)

<h2 id="disclaimer">Disclaimer</h2>

This is an incredibly terrible theme code-wise. However, it does *technically* work.

Before going forward with this starter, please be aware of the following.

1. The code is absolutely horrendous and uses a lot of hacky solutions. Do not use this for a serious project because maintaining it will be a nightmare.
2. Most of the code was taken from other sources, mainly [eleventy-deep-pagination](https://github.com/solution-loisir/eleventy-deep-pagination), [vredeburg](https://github.com/dafiulh/vredeburg), and [this guide](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/). If you just want a solution to nested pagination, check those out.
3. If you just want paginated tag pages and don't need multiple author support, you should use the [vredeburg theme](https://github.com/dafiulh/vredeburg).

If that doesn't scare you away, feel free to do whatever with this starter (I am not responsible for any headaches this causes).

**Are you a skilled Eleventy user?** If so, I highly encourage you to one-up this starter template and make your own with the features below - but with an actually good codebase.

<h2 id="features">Features</h2>

First things first, this is a blog/magazine/news starter. Here are the features included:

- A page to browse blog posts, paginated.
- Multiple author support (so each blog post can be assigned an author).
- Author pages. Each author gets their own page which includes a paginated list of all blog posts by them.
- Tag support (so each blog post can be assigned tags).
- Tag pages. Each tag gets its own page which includes a paginated list of all posts with the respective tag.

I cannot say this enough, but if you do not need multiple author support, use the [vredeburg theme](https://github.com/dafiulh/vredeburg).

<h2 id="documentation">Documentation</h2>

### `.eleventy.js`

Change the `const` `postsPerPaginatedPage` (which is in `.eleventy.js`) to however many posts you want to display on a page. You will need to also change the value in `_src/posts.njk` because that does not use nested pagination.

### `_data/`

`_src/_data/` is the global data folder. It contains `authors.json` and `metadata.json`.

- `authors.json` is where you can add, edit, or delete authors.
- `metadata.json` is where you should keep any relevant site data such as the site name and URL.

### `_includes/`

`_src/_includes/` contains code to be reused, such as templates and partials.

- `base.njk` is the base template that all other templates should use as a base.
- `/partials/` is for code components.
- `/templates/` is for page templates.

### `assets/`

Assets include any files like images, videos, CSS, and JavaScript. Keep these in the `_src/assets/` folder in order for them to be generated with the site.

You do not have to use the folders inside `_src/assets/` but I provided some for you to use if you want.

- `/css/` is where you can keep your CSS.
- `/img/` is where you can keep any images.
- `/js/` is where you can keep any JavaScript.

### `authors/`

- `author.njk` generates a page for every author, including all their blog posts, paginated.
- `authors.njk` is a page listing every author from `_src/_data/authors.json`.

### `posts/`

This is where all blog posts will be.

- `posts.json` is for frontmatter that all blog posts should have.
- `*.md` is all the blog posts. The file name will be used in the URL (i.e. `first-post.md` will be located at `/posts/first-post/` on the site).

Here is what the frontmatter for a post looks like.

```yaml
---
title: "Need More Time? Read These Tips To Eliminate Debt"
desc: "I love Halloween. The one time of year when everyone wears a mask … not just me. I'm really more an apartment person. Under normal circumstances, I'd take that as a compliment. This man is a knight in shining armor."
tags:
    - one
    - two
date: 2022-02-16
author: john
---
```

- `title` (string) is for the post's title.
- `desc` (string) is for the post's description.
- `tags` (array) is for the post's tags.
- `date` (date) is for the post's date, in the format `yyyy-mm-dd`.
- `author` is for the author's key. Only one author per post is supported.

### `tags`

- `tag.njk` generates a page for every tag, including all blog posts with that tag, paginated.
- `tags.njk` is a page listing every tag.

### `404.njk`

The 404 page. It will work for both [GitHub pages](https://help.github.com/articles/creating-a-custom-404-page-for-your-github-pages-site/) and [Netlify](https://www.netlify.com/docs/redirects/#custom-404).

### `index.njk`

The website homepage. For this demo, it shows the most recent 3 blog posts.

### `posts.njk`

The post archive page. It shows all blog posts, paginated.

<h2 id="how-to">How-To</h2>

### Use the starter...

First, read the [disclaimer](#disclaimer).

1. Clone the repository
    ```sh
    git clone https://github.com/MoldyMacaroniX/dream-eleventy-starter.git website-name
    ```
2. Navigate to the directory
    ```sh
    cd website-name
    ```
3. Install dependencies
    ```sh
    npm i
    ```
4. Run Eleventy
    ```sh
    npx eleventy
    ```

### Change how many posts are shown per page...

See the [documentation](#documentation), but in a nutshell, change the both the `postsPerPaginatedPage` `const` in `.eleventy.js` and the pagination size in `_src/posts.njk` to whatever you want.

### Use author data (such as name and bio) in frontmatter...

Not possible. Instead, there is a hacky workaround for author pages to add author data to the `<head>` element in `base.njk` (such as for `<title>` elements and other SEO metadata).

```njk
<title>
    {% if pageID !== "authorPosts" %}
        {{ title }}
    {% else %}
        {{ myAuthor.name }}
    {% endif %}
</title>
```

Use the above snippet, where `{{ title }}` is the default frontmatter, and `{{ myAuthor.name }}` is the author data (change `name` to whatever piece of data you want to grab).

<h2 id="credits">Credits</h2>

Most of the code was taken from the following sources:

- [eleventy-deep-pagination](https://github.com/solution-loisir/eleventy-deep-pagination)
- [vredeburg](https://github.com/dafiulh/vredeburg)
- [Basic custom taxonomies with Eleventy](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/)
- [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog)

This starter uses dummy content from the following sources:

- [Fillerama](http://fillerama.io/)
- [Headline Generator](https://www.title-generator.com/)