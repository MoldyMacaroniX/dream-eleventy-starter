const { DateTime } = require("luxon");
const lodashChunk = require('lodash.chunk');
const lodash = require("./lodash");

function getAllKeyValues(collectionArray, key) {
    // get all values from collection
    let allValues = collectionArray.map((item) => {
      let values = item.data[key] ? item.data[key] : [];
      return values;
    });
    
    // flatten values array
    allValues = lodash.flattenDeep(allValues);
    // to lowercase
    allValues = allValues.map((item) => item.toLowerCase());
    // remove duplicates
    allValues = [...new Set(allValues)];
    // order alphabetically
    allValues = allValues.sort(function (a, b) {
      return a.localeCompare(b, "en", { sensitivity: "base" });
    });
    // return
    return allValues;
}

module.exports = (config) => {

    // === AMOUNT OF POSTS PER PAGE === //
    const postsPerPaginatedPage = 3;

    config.addPassthroughCopy('_src/assets');
    config.addPassthroughCopy({'_src/static':  '.'});

    /**
     * Collection containing all posts
     * @param {any} collection - The date
     * @returns {any} - all posts
     */
    config.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("_src/posts/*.md").reverse();
    });

    /**
     * Returns true if the input is an array, false otherwise.
     * @param {any} dateObj - The date
     * @returns {any} - The date in a readable form
     */
    config.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });

    /**
     * Returns true if the input is an array, false otherwise.
     * @param {any} maybeArray - The input in question.
     * @returns {boolean} - The input inside an array - or itself if the input was an array.
     */
    config.addFilter("isArray", (maybeArray) => {
        return Array.isArray(maybeArray);
    });

    /**
     * Turns a non-array into an array, or does nothing if it is already an array.
     * @param {any} maybeArray - The input. If it is not an array, it will be turned into an array. If it is already an array, it will do nothing.
     * @returns {array} - The input inside an array - or itself if the input was an array.
     */
    config.addFilter("makeArray", (maybeArray) => {
        if (Array.isArray(maybeArray)) {
            return maybeArray;
        }
        return arr = [maybeArray];
    });

    /**
     * Gets data for an author
     * @param {any} authors
     * @param {any} label
     * @returns {any} - Data structure containing all author data
     */
    config.addFilter("getAuthor", (authors,label) => {
        let author = authors.filter(a => a.key === label)[0];
	    return author;
    });

    /**
     * Get posts from an author
     * @param {any} posts - all posts
     * @param {any} author - the author who's posts you want
     * @returns {any} - All of that author's posts
     */
    config.addFilter("getPostsByAuthor", (posts,author) => {
        return posts.filter(a => a.data.author === author);
    });

    /**
     * Collection for all blog posts
     * @param {any} collection
     * @returns {any} - Collection of all blog posts
     */
    config.addCollection("blogposts", function (collection) {
        return collection.getFilteredByGlob("./src/blogposts/*.md").reverse();
    });

    /**
     * collection for all posts, double-layer paginated by tag
     * @param {any} collection
     * @returns {any} - double-layered paginated by tag list of all posts
     */
    config.addCollection("pagedTags", function(collection) {
        const postsCollection = collection.getFilteredByGlob('_src/posts/*.md');
        let tagSet = new Set();
        postsCollection.forEach(templateObjet => {
            if('tags' in templateObjet.data) {
                const tagsProperty = templateObjet.data.tags;
                if(Array.isArray(tagsProperty)) {
                    tagsProperty.forEach(tag => tagSet.add(tag));
                } else if(typeof tagsProperty === 'string') {
                    tagSet.add(tagsProperty);
                }
            }
        });
        const pagedTags = [];
        let pagedCollectionMaxIndex;
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag).reverse();
            const pagedCollection = lodashChunk(tagCollection, postsPerPaginatedPage);
            pagedCollection.forEach((templateObjectsArray, index) => {
                pagedCollectionMaxIndex = index;
                pagedTags.push({
                    tagName: tag,
                    path: `/tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                    pageNumber: index,
                    templateObjets: templateObjectsArray
                });
            });
        });
        const pagedCollectionLength = ++pagedCollectionMaxIndex;
        const groupedByTagName = lodashChunk(pagedTags, pagedCollectionLength);
        groupedByTagName.forEach(group => {
            group.forEach((pageObject, index, source) => {
                pageObject.first = source[0].path;
                pageObject.last = source[source.length - 1].path;
                pageObject.lastIndex = source.length - 1;
                if(source[index - 1]) pageObject.previous = source[index - 1].path;
                if(source[index + 1]) pageObject.next = source[index + 1].path;
            });
        });
        return pagedTags;
    });

    /**
     * collection for all posts, double-layer paginated by author
     * @param {any} collection
     * @returns {any} - double-layered paginated by author list of all posts
     */
    config.addCollection("authorPosts", function (collection) {
        let allCategories = getAllKeyValues(
          collection.getFilteredByGlob("_src/posts/*.md"),
          "author"
        );
    
        let blogCategories = allCategories.map((category) => ({
          title: category,
          slug: category,
        }));
    
        return blogCategories;
    });

    // create flattened paginated blogposts per categories collection
    // based on Zach Leatherman's solution - https://github.com/11ty/eleventy/issues/332
    config.addCollection("pagedAuthorPosts", function (collection) {
        const itemsPerPage = postsPerPaginatedPage;
        let blogpostsByCategories = [];
        let allBlogposts = collection
        .getFilteredByGlob("_src/posts/*.md")
        .reverse();
        let blogpostsCategories = getAllKeyValues(allBlogposts, "author");
    
        // walk over each unique category
        blogpostsCategories.forEach((category) => {
        let sanitizedCategory = lodash.deburr(category).toLowerCase();
        // create array of posts in that category
        let postsInCategory = allBlogposts.filter((post) => {
            let postCategories = post.data.author ? post.data.author : [];
            // let sanitizedPostCategories = postCategories.map((item) => lodash.deburr(item).toLowerCase() );
            return postCategories.includes(sanitizedCategory);
        });
    
        // chunck the array of posts
        let chunkedPostsInCategory = lodash.chunk(postsInCategory, itemsPerPage);
    
        // create array of page slugs
        let pagesSlugs = [];
        for (let i = 0; i < chunkedPostsInCategory.length; i++) {
            let categorySlug = category;
            let pageSlug = i > 0 ? `${categorySlug}/${i + 1}` : `${categorySlug}`;
            pagesSlugs.push(pageSlug);
        }

        // let author = category.filter(a => a.key === category)[0].name;
    
        // create array of objects
        chunkedPostsInCategory.forEach((posts, index) => {
            blogpostsByCategories.push({
            title: category,
            name: "a", // a
            slug: pagesSlugs[index],
            pageNumber: index,
            totalPages: pagesSlugs.length,
            pageSlugs: {
                all: pagesSlugs,
                next: pagesSlugs[index + 1] || null,
                previous: pagesSlugs[index - 1] || null,
                first: pagesSlugs[0] || null,
                last: pagesSlugs[pagesSlugs.length - 1] || null,
            },
            items: posts,
            });
        });
        });
    
        return blogpostsByCategories;
    });

    /**
     * collection for all tags
     * @param {any} collection
     * @returns {any} - Data structure containing all tags
     */
    config.addCollection("tagList", function(collection) {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
          (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });
    
        return tagSet;
    });

    /**
     * Gets the first `n` elements of a collection.
     * @param {any} array - the collection in question
     * * @param {any} n - first `n` elements to get
     * @returns {any} - the first `n` elements of the collection
     */
    config.addFilter("head", (array, n) => {
        if(!Array.isArray(array) || array.length === 0) {
        return [];
        }
        if( n < 0 ) {
        return array.slice(n);
        }

        return array.slice(0, n);
    });

    return {
        dir: {
            input: '_src',
            output: '_dist'
        },
        // pathPrefix: "/subfolder/",
        templateFormats: ['md', 'njk', 'html'],
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    };

};