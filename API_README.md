# 🚀 Dummy API - Complete Documentation Structure

This repository contains a comprehensive dummy API setup with Mintlify documentation that demonstrates the full structure and capabilities of API documentation.

## 📋 What's Included

### 1. **OpenAPI Specification** (`openapi.yaml`)

- Complete API specification with multiple endpoints
- Request/response schemas and examples
- Authentication mechanisms
- Error handling patterns
- File upload support

### 2. **Mintlify Documentation**

- **API Reference**: Auto-generated from OpenAPI spec
- **Endpoint Examples**: Detailed documentation for each endpoint
- **Interactive Playground**: Test endpoints directly in the docs
- **Code Examples**: cURL, JavaScript, Python examples

### 3. **Working Server Implementation** (`server-example.js`)

- Express.js server with all endpoints implemented
- JWT authentication
- File upload handling
- Input validation
- Error handling

## 🔗 API Endpoints

### Authentication

- `POST /auth/login` - User authentication with JWT tokens

### User Management

- `GET /users` - Get all users (paginated)
- `POST /users` - Create new user account
- `GET /users/{id}` - Get specific user

### Content Management

- `GET /posts` - Get all posts (with filtering)
- `POST /posts` - Create new blog post

### File Management

- `POST /files/upload` - Upload files (multipart/form-data)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd docs
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Test the API

#### Create a User

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Create a Post (with authentication)

```bash
curl -X POST http://localhost:3000/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is my first blog post!",
    "category": "technology"
  }'
```

## 📚 Documentation Structure

### Mintlify Configuration (`docs.json`)

- Navigation structure
- Theme customization
- Global settings
- Logo and branding

### OpenAPI Specification (`openapi.yaml`)

- **Info**: API metadata, contact, servers
- **Paths**: All endpoint definitions
- **Components**: Reusable schemas and security schemes
- **Examples**: Sample requests and responses

### Endpoint Documentation

Each endpoint has its own `.mdx` file with:

- Detailed descriptions
- Request/response examples
- Code snippets
- Error handling
- Related endpoints

## 🎯 Key Features Demonstrated

### 1. **Comprehensive API Design**

- RESTful principles
- Proper HTTP status codes
- Consistent error handling
- Pagination support
- Filtering capabilities

### 2. **Security Implementation**

- JWT authentication
- Password hashing
- Input validation
- Rate limiting considerations
- File upload security

### 3. **Documentation Best Practices**

- Clear endpoint descriptions
- Multiple code examples
- Interactive testing
- Visual hierarchy
- Cross-references

### 4. **Real-world Scenarios**

- User registration/login flow
- Content management
- File uploads
- Error handling
- Authentication flows

## 🔧 Customization

### Adding New Endpoints

1. Add the endpoint to `openapi.yaml`
2. Create corresponding `.mdx` file in `api-reference/endpoint/`
3. Update `docs.json` navigation
4. Implement in `server-example.js`

### Modifying Documentation

- Edit `.mdx` files for content changes
- Update `openapi.yaml` for API changes
- Modify `docs.json` for navigation/styling

### Server Customization

- Add database integration
- Implement additional middleware
- Add more validation rules
- Extend error handling

## 📖 Learning Resources

This dummy API demonstrates:

1. **API Design Patterns**

   - RESTful conventions
   - Resource naming
   - HTTP method usage
   - Status code selection

2. **Documentation Standards**

   - OpenAPI specification
   - Interactive documentation
   - Code examples
   - Error documentation

3. **Implementation Best Practices**

   - Express.js patterns
   - Middleware usage
   - Error handling
   - Security considerations

4. **Mintlify Features**
   - Auto-generated API docs
   - Custom MDX pages
   - Navigation structure
   - Theme customization

## 🤝 Contributing

Feel free to extend this dummy API with:

- Additional endpoints
- More complex data models
- Advanced authentication
- Database integration
- Testing examples

## 📄 License

MIT License - feel free to use this as a starting point for your own API documentation projects!
