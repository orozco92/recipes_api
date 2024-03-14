# RecipeHub

## Project Overview
RecipeHub is a web application that allows users to discover, share, and rate recipes. Users can create accounts, log in, add their favorite recipes, and explore recipes shared by others. The application will have features such as user authentication, recipe rating, user favorites, and a REST API to interact with the data.

## Functional Requirements

1. **User Authentication:**
   - Users should be able to create accounts.
   - Users should be able to log in and log out.
   - Only authenticated users should be able to add, edit, or delete their recipes.

2. **Recipe Management:**
   - Authenticated users can add new recipes with the following details:
      - Title
      - Ingredients
      - Instructions
      - Cooking time
      - Difficulty level
   - Users can edit or delete their own recipes.

3. **Recipe Rating:**
   - Users can rate recipes on a scale of 1 to 5.
   - Average rating should be displayed for each recipe.
   - Users can only rate a recipe once.

4. **User Favorites:**
   - Users can mark recipes as their favorites.
   - Users can view a list of their favorite recipes.

5. **Search and Filtering:**
   - Users can search for recipes based on title, ingredients, or difficulty level.
   - Recipes can be filtered based on different criteria (e.g., most popular, highest-rated).

6. **REST API:**
   - Implement a RESTful API for the following actions:
      - Get a list of all recipes.
      - Get details of a specific recipe.
      - Add a new recipe (requires authentication).
      - Edit an existing recipe (requires authentication).
      - Delete a recipe (requires authentication).
      - Rate a recipe (requires authentication).
      - Mark a recipe as a favorite (requires authentication).
      - Get a list of user's favorite recipes (requires authentication).

7. **Security:**
   - Use JWT (JSON Web Tokens) for authentication.
   - Implement proper error handling and validation.

## Technical Stack

### Frontend
- Use a modern frontend framework (e.g., Angular, React, Vue.js).
- Implement user interfaces for authentication, recipe listing, adding/editing recipes, and viewing user favorites.

### Backend
- Use NestJS for the backend.
- Utilize TypeORM for database interactions.
- Implement authentication middleware using JWT.
- Set up controllers and services for managing recipes, ratings, and favorites.
- Integrate Redis for caching frequently accessed data.

### Database
- Choose a relational database (e.g., PostgreSQL, MySQL) for storing user information, recipes, ratings, and favorites.

### Redis
- Integrate Redis for caching frequently accessed data and managing user sessions.

### API Documentation
- Generate API documentation using tools like Swagger or OpenAPI.

## Development Steps

1. Set up the NestJS project structure.
2. Implement user authentication using JWT.
3. Integrate Redis for caching frequently accessed data, such as recipe details.
4. Create database models for users, recipes, ratings, and favorites using TypeORM.
5. Set up TypeORM for database interactions.
6. Implement controllers and services for managing recipes, ratings, and favorites.
7. Develop frontend components for user authentication, recipe listing, and interaction.
8. Integrate frontend with backend APIs.
9. Implement search and filtering functionalities.
10. Use Redis to cache frequently accessed data and optimize performance.
11. Handle errors and validation on both frontend and backend.
12. Test the application thoroughly.
13. Document the API using Swagger or OpenAPI.

By incorporating Redis, you'll gain experience in working with a caching system and session management, adding valuable skills to your project. Make sure to refer to the NestJS and Redis documentation for proper integration and best practices. Good luck!
