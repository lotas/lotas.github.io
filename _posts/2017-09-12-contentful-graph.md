---
layout: post
title:  "Contentful Graph"
date:   2017-09-12
tags: ["contentful", "dot", "graphviz", "visualisation"]
---

# About Contentful

[Contentful](https://www.contentful.com) is a "headless CMS", one of the first successful tools in this field.
It helps you to define content types, and let non-technical people modify content.
Later you would simply use contentful API to fetch it and use it to your needs.

# The problem

In real-world projects, those types tend to grow in size and complexity very fast.
And as it grows, it becomes harder to remember connections between models.

To make it easier to understand content model, I decided to represent this information in form of directed graph. My idea was to build the graph to see who is using who, and visualize it with [graphviz](https://www.graphviz.org/)

So [contentful-graph](https://github.com/lotas/contentful-graph) package was created.

`contentful-graph` uses contentful API to fetch model definitions, parses it and outputs content types and relationships in `.dot` format. This can be later used to generate image or PDF.

You can read more about it in Contentful [blog post](https://www.contentful.com/blog/2017/08/08/how-to-quickly-visualize-your-content-model/) about contentful-graph.

I would like to present below my notes from the Meetup that happened on 12 of September 2017.

## Meetup notes

[Contentful User Meetup](https://www.contentfulcommunity.com/t/berlin-sept-12-contentful-user-meetup/201)


### Component 1:1 matching
Simple model:

![](/img/contentful-graph/2021-06-08-22-37-10.png)
![](/img/contentful-graph/2021-06-08-22-37-45.png)

More complex model:
![](/img/contentful-graph/2021-06-08-22-38-33.png)

### What to do

- Try to understand the model
  * Click around files in project
  * Open all model definitions in contentful
  * Do some hand-drawings on the nearby walls

- Make it easy to understand
  * Visualise
  * Automate

### Use Contentful API

API:
- Content Delivery  (CDA) (read content, media, type definitions)
- Content Management (CMA) (manage content, content types)

Content type definitions:
- Fetch all
- Build dependency graph
- Visualise it

### Understanding model relations

Mode field definitions:
```
linkType: ‘Asset’
type: ‘Link’
  linkContentType[]: ‘linkedModel’
```

Type of relationship:

```
1:1     field.validations[]  (CMA)
1:many  field.items[]
```

```
"PressCarousel": {
    "fields": [{
          "id": "children",
          "name": "Children",
          "type": "Array",
          "validations": [],
          "items": {
            "type": "Link",
            "validations": [{
                "linkContentType": [
                  "press"
                ]
              }
            ],
            "linkType": "Entry|Asset"
          }
```

```
"PressCarousel": {
     "fields": [{
          "id": "children",
          "name": "Children",
          "type": "Array",
          "validations": [{
              "linkMimetypeGroup": [
                "image"
              ]
            }
          ],
          "items": {
            "type": "Link",
            "validations": [{
                "linkContentType": [
                  "press"
                ]
```


### Visualising connections

```
$ npx contentful-graph

digraph obj {
  node[shape=record];

  Category ;
  Author ;
  Post ;
  Author -> Post;
  Post -> Author;
  Post -> Category;
}

models.dot
```

![](/img/contentful-graph/2021-06-08-22-43-29.png)

![](/img/contentful-graph/2021-06-08-22-43-48.png)

#### Real world models

Usually look like this
![](/img/contentful-graph/2021-06-08-22-45-21.png)


## Web version

The day before the meetup I also created Web version - [`contentful-graph-web`](https://github.com/lotas/contentful-graph-web) so people could play around with output in multiple way in browser.

![demo](/img/contentful-graph/demo.gif)

