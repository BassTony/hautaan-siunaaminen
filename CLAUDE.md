# Hautaan siunaaminen

## Purpose

- The purpose of this project is to make publicly available the contents of a funeral service in Finnish Lutheran Church. The document is found in https://kirkkokasikirja.fi and the document title is "hautaan siunaaminen".

## App Structure

- This project will make a staticly served web app that lets users select between all the variations of texts and approaches in "hautaan siunaaminen" liturgy. Then it will enable the user to print the lotirgy with all the choices numbered as in the original liturgy, but the non-selected parts removed for clarity.
- With any music there will be preselected options as listed in https://virsikirja.fi in the theme "Hautaan siunaaminen". Also make available a text field to insert your own music choices.
- User may input the name of the deceased person that will be used to fill in the various "N.N." or "NN" placeholders in the text. Some rudimentary Finnish name conjugation is needed. Find an app library or create TypeScript code to conjugate names properly in Finnish to complete this task.

## Architecture and development tools

- select the most suitable architecture: zero-cost, easy maintainability, future integrations.
- select a JS (TypeScript) framework that has the minimum toolchain complexity. Review options that are the likes of `Vite+React+TS`, `bun`, `Svelte`, `Vue`, `Angular`, `Lit`, `Stencil`, `Solid`, `Alpine`, `Mithril`, `Next.js`, `Astro`.
- The app should save the choices made in localStorage with a name of the save file and the date of the event (these are asked from the user). 
- The app will be served statically in GitHub Pages for username "basstony"
- 

## Procedure

1. Select the framework and install it and all the necessary tools.
2. download all the relevant files listed above and analyse their contents.
3. create the app structure capable of saving to localstoreage with multiple selection tools
4. document everything you do in CLAUDE_log.md complete with code snippets. Read the TODO section from end of file. Work on the tasks and write new sections to `CLAUDE_log.md` accordingly.
