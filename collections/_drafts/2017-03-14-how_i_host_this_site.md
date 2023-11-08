---
layout: post
title:  "How I Host This Site"
date:   2017-3-13 00:48:02 -0600
categories: jekyll update
published: true
type: blog
---

{% include article_image.html img="/assets/images/posts/oldest-site-version.jpg"
    caption="The oldest version of this site available from <i>Wayback Machine</i>, January 2011"%}

I've had this portfolio in some form for the past eight years but it's only recently that I've started to feel like I have fully considered and made appropriate choices from top to bottom. If you have some of the same background that I do, and have similar needs from a portfolio website, here's a case study.

## Development

I don't want to manage a CMS and database, and because I have such light requirements, I wouldn't benefit much from the additional capabilities. I chose *Jekyll* because it had the most traction.

## Hosting

Hosting Jekyll sites on GitHub Pages is free, but many useful plugins aren't supported and you aren't allowed to deploy your own for security reasons. Instead, I chose to use a VPS through *Digital Ocean*. Shared hosting might be a little cheaper, but $60 a year buys you complete control over a server. There are a number of cheap VPS services, but I initially chose them because of their generous GitHub Student Pack promo code.

## DNS + CDN

**CloudFlare**. CloudFlare provides an HTTP proxy and DNS services for free. If you're only going to be using the VPS to host your staticly generated portfolio, the proxy won't help you much, but its a nice safety net in case your site should ever go down. They'll even provide SSL certs to cover every domain that they proxy.

## Domain Registrar

**NameCheap**. They don't have the greatest admin interface, but their prices are competitive and they stay on top of new TLDs. 

## Mail

*Zoho*. Hosting your own email server is a nightmare. Zoho lets you point your MX records at their servers and call it a day, for free if you only need a single address. They provide a fairly vanila webmail interface and IMAP access.

## Deployment

I don't mind having my site's source publicly available, and using a service like *GitHub* lets me use GitHub actions to deploy the site on every push. I adapted a script to run Jekyll and copy the files to the web root
