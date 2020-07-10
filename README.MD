## Welcome to SocialNetwork

Hi! I'm **Gleyson Abreu**. As a programming student, I created these APIs to learn more about NODEJS, TYPESCRIPT and other technologies. 

# ABOUT

This API works on any database(mysql, postgres, etc..). You can create Users, make Posts, Like posts, delete posts, create comment, like comment, delete comment, create session, uploads profile pictures.
## ROUTES

You can use **Insomnia** to create your routes, but there are other software to do this, make you choice.
Click the button below to import all routes to your Insomnia.
<p  align="center">
<a  href="https://insomnia.rest/run/?label=SocialNetwork&uri=https%3A%2F%2Fgist.githubusercontent.com%2Fgleysonabreu%2F6dfde7ab6f7bad5c3d5f25556bb04a3e%2Fraw%2F8cf4685c8a45055ecbedd503cf579aff32c4d1fb%2FInsomnia_2020-07-08.har"  target="_blank"><img  src="https://insomnia.rest/images/run.svg"  alt="Run in Insomnia"></a>
</p>

## PRE REQUISITES 

1. It's necessary you have installed the [Node.js](https://nodejs.org/en/)
2. Use a package manager of your choice ([NPM](https://www.npmjs.com/), [YARN](https://yarnpkg.com/), etc.) in order to install all dependencies

## INSTALLATION

1. Using the git clone to download the files.
    ```
    git clone https://github.com/gleysonabreu/socialnetwork.git
    ```
2. Using npm or yarn to install all dependencies.
    ```
    npm install
    yarn install
    ```
3. Create file .env with:
    ```
    PORT=3333 <- DEFAULT
    PG_CONNECTION= <- URL CONNECTION WITH YOUR POSTGRES
    SECRET_KEY= <- SECRET KEY TO CREATE A SESSION's
    AWS_ACCESS_KEY_ID= <- AMAZON AWS TO SEND FILES FOR SERVER.
    AWS_SECRET_ACCESS_KEY= <- AMAZON AWS TO SEND FILES FOR SERVER.
    AWS_DEFAULT_REGION= <- AMAZON AWS TO SEND FILES FOR SERVER.
    ```
5. Use this command yarn/npm knex:migrate to create all tables in the database.
6. Use yarn/npm build to generate a build production.
7. Use yarn/npm dev to start the server.
