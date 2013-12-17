Data-driven Single Page App using YUI
=====================================

A simple record system, driven by php scripts, and using YUI's app framework.

This project is in a series of stages and is designed as tutorial material for my students, please feel free to correct any mistakes you find.

I use an apache alias of yui-srsSteps, you can create your own alias for testing named whatever you want, just make the appropriate changes to the .htaccess file and other source files.

I have a simple .htaccess file which uses this alias to redirect all http requests to index.html.  The javascript linked to in that file handles all routing of such requests.  By the way, if you change the name of your alias from yui-srsSteps you should update the appropriate references below:

<pre>
&lt;IfModule mod_rewrite.c&gt;

  RewriteEngine On
  RewriteBase /yui-srsSteps

  # internally rewrite paths to query strings but only if:
  # the request isn't for an existing file
  RewriteCond %{REQUEST_FILENAME} !-f
  # the request isn't for an existing directory
  RewriteCond %{REQUEST_FILENAME} !-d
  # the request isn't for the index file itself
  RewriteCond %{REQUEST_URI} !^/index\.html
  # now redirect everything that passes those conditions to index.html regardless of the path
  RewriteRule ^(.+)$ /yui-srsSteps/index.html [NS,L]
&lt;/IfModule&gt;
</pre>