## Setup

```shell
npm install
```


## Testing

### Unit tests

```shell
npm run test
```

### e2e tests

Link database schema.
Replace you-project-ref beforehand.
This will ask you for authentication via browser.
```shell
npx supabase link --project-ref your-project-ref
```

Pull schema
```shell
npx supabase db pull --linked
```

Boot up local supabase instance.
Has to have Docker running
```shell
npx supabase start
```

Then run tests
```shell
npm run test:e2e
```