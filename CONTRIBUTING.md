# Contributing Guide

## Setting up development environment

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository with `git clone https://github.com/Print-one/print-one-js.git`
2. Enter the repository, and run `npm install` to install all dependencies.
3. Run `npm run test` to run the tests. NOTE: This requires you to have followed the setting up test environment steps (see below).

## Setting up test environment

To setup the test environment, copy over the `.env.example` file to `.env` and fill in the required values.
To then run the tests, run `npm run test`.

## The "next" branch

We have a branch called `next` that is used for features that are behind feature flags. All unreleased features / features still in development will be in this branch. If you want to contribute to a feature that is still in this state, make sure to branch off of `next` and submit a pull request to `next`.

Next should also be kept in sync with `main` as much as possible, so that we can easily cherry-pick features into `main` when we are ready to release them.

## Pull Requests

Make sure when submitting a pull requests that your code passes the tests, and that you have written tests for any new features or bug fixes.
