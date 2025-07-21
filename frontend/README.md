when I run npm run build then i have to push the dist folder to the aws s3 bucket called pencraft.varuntd.com
For that i need to download aws cli and sudo was not available in powershell so i installed wsl and ubuntu on my windows machine.
then i installed aws cli and configured it with secret access key, key id, region and default output json.
then i ran cd /mnt/d/study/PenCraft_app/frontend/dist
aws s3 sync . s3://pencraft.varuntd.com --delete

And I guess this much i need to do, and as i have set up cloudfront and ssl so i guess its not required everytime i change code.


### Why use `encodeURIComponent(key)` in image URLs?

In `frontend\src\components\BlogPage\BlogContentRenderer.tsx`, the following code is used to construct image URLs:

```ts
`${BACKEND_URL}/api/v1/blog/images/${encodeURIComponent(key)}`
```

#### Purpose

- **Builds a complete URL** by combining your backend base URL with the API endpoint.
- **URL-encodes the key** using `encodeURIComponent(key)` before adding it to the URL path.

#### Why encode the key?

S3 keys can contain special characters that are not safe in URLs, such as:

- Spaces (` `)
- Forward slashes (`/`)
- Plus signs (`+`)
- Ampersands (`&`)
- Question marks (`?`)
- Hash symbols (`#`)

If you use the key directly, the URL may be malformed.  
**Example:**

- **Unencoded:**  
  `https://api.example.com/api/v1/blog/images/user-uploads/my image file & more.jpg`
- **Encoded:**  
  `https://api.example.com/api/v1/blog/images/user-uploads%2Fmy%20image%20file%20%26%20more.jpg`

Encoding ensures the URL is properly formatted and the backend can correctly parse and decode the S3 key to fetch the image.


## Add Caching to Reduce API Calls
```js
// Add this at the top of BlogContentRenderer.tsx file (outside components)
const presignedUrlCache = new Map<string, { url: string; expires: number }>();

// Inside BlogImage component, replace fetchPresignedUrl with:
const fetchPresignedUrl = async (key: string): Promise<string> => {
  // Check cache first (presigned URLs typically expire in 1 hour)
  const cached = presignedUrlCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.url;
  }

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/blog/images/${encodeURIComponent(key)}`,
      {
        headers: {
          Authorization: localStorage.getItem("pencraft_token")
        }
      }
    );
    
    const signedUrl = response.data.signedUrl;
    
    // Cache for 50 minutes (presigned URLs usually expire in 1 hour)
    presignedUrlCache.set(key, {
      url: signedUrl,
      expires: Date.now() + (50 * 60 * 1000)
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Failed to fetch presigned URL:', error);
    throw new Error('Failed to get image URL');
  }
};
```















# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
