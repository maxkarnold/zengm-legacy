# Devblog

## Intro

I'm writing this dev blog while I update the moba gm for zengm-legacy. I'm hoping this blog will help developers in the future as well as give me something to look back on.

## Start/Refactoring

### 5/21/25

After looking into this project there have been cautionary tales from "dumbmatter", creator of zengm-legacy, that the codebase used to be maintained by one other developer but he had moved on from the project. Others have looked at the project and have found it too daunting to fix. So I know that this won't be a walk in the park or a quick fix. However, I plan on bringing life back to moba gm in one form or another.

Starting off, I'm going to do some structural updates since the code hasn't been touched in 2 years at least. Its currently using yarn as a package manager with React for the main code files. Currently the files are js rather than tsx which is used in the main zengm codebase. I'm going to try to update to tsx to make the dev experience better. Need to take baby steps here.

There's an issue where we are using Browserify as a bundler and I am trying to switch to Rollup.js to be more in line with modern zengm games.

I'm currently trying to convert most files to tsx files to be in line with zengm-games.

### 5/29/25

I've managed to convert most of the files to typescript files. I'm doing some cleanup and updated Babel as well as including a `.babelrc` file to clean up the code. When running `yarn run build` I've managed to reach a point where it stops the build for typescript errors in the code. There are quite a large amount of errors unfortunately, most of them are very similar to each other. I will starting cleaning up each file to get the build to work again.
