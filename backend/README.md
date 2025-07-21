```
npm install
npm run dev
```

```
npm run deploy
```


so we have two database url, one is the actual url that we get from cloud db providers and one is the accelerate url that we get using the provider url. Your .env file should NOT contain production secrets and should NOT be committed to git.
Your wrangler.toml if has hardcoded secret vars, is not good either.