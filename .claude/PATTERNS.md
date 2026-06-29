# PATTERNS.md

## Naming conventions

| Item | Convention | Example |
|------|-----------|---------|
| Pages | kebab-case folders, `index.tsx` | `pages/appointment-type/index.tsx` |
| Container components | PascalCase, suffix `Container` | `AppointmentTypesContainer` |
| Container hooks | `use-{feature}.ts`, camelCase | `use-appointment-list-container.ts` |
| Query files | `{resource}-query.ts` or `get-{resource}-query.ts` | `appointments-query.ts`, `get-patient-query.ts` |
| Mutation files | `{resource}-mutation.ts` | `create-appointment-mutation.ts` |
| Types | `{resource}.{type}.ts` | `medical-control.types.ts` |
| Route builder | defined in `routes.ts`, consumed via `useNavigation()` | `nav.appointments.manage(id)` |

**Known typos to preserve** (don't rename — would break imports):
- `src/shared/api/querys/` (not `queries`)
- `src/shared/api/mutations/users/create-user-matation.ts` (not `mutation`)
- `src/shared/constants/sidebar.ts` (there's also a `sidebard.ts` stash file — ignore it)

## Component structure (container pattern)

Every feature has two files:

```
components/containers/{feature}/
├── {feature}-container.tsx     # Pure JSX — only imports hook, renders UI
└── use-{feature}.ts            # All logic: queries, mutations, state, handlers
```

The container **never** imports React Query directly. The hook returns `{ states, setters, methods }` or named values.

```tsx
// Pattern in container:
export const MyContainer: React.FC = () => {
  const { data, isLoading, handleSubmit } = useMyFeature();
  if (isLoading) return <Skeleton />;
  return <div>...</div>;
};

// Pattern in hook:
export function useMyFeature() {
  const { data, isLoading } = useMyQuery();
  const { mutate } = useMyMutation();
  // ...
  return { data, isLoading, handleSubmit };
}
```

Some older files inline a local hook (`use-{name}.ts` next to the page file). New code follows the container pattern.

## API calls — queries

Use TanStack Query. Every query file exports:
1. A service object with static async methods
2. A query key constant (`FETCH_X_KEY`)
3. A `useXQuery()` hook

```ts
// Example pattern
const MyService = {
  fetchAll: async () => ApiServiceClient(env.API.MEDICAL_RECORDS_URL).get('/resource'),
};

export const FETCH_MY_KEY = 'fetchMyResource';

export function useMyQuery() {
  return useQuery({
    queryKey: [FETCH_MY_KEY],
    queryFn: MyService.fetchAll,
  });
}
```

Useful defaults to add when needed:
- `placeholderData: (previousData) => previousData` — keeps previous data during refetch
- `staleTime: 1000 * 60 * 5` — 5-minute cache for detail queries
- `enabled: !!id` — skip query when ID is not yet available

## API calls — mutations

Use `useApiMutation` (thin wrapper around `useMutation`) from `src/shared/api/mutations/use-api-mutation.ts`.

```ts
export function useCreateXMutation() {
  const { mutate: executeCreateX, isPending, isSuccess, error } = useApiMutation({
    mutationKey: ['createX'],
    mutationFn: (payload: CreateXPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post('/resource', payload),
  });
  return { executeCreateX, isPending, isSuccess, error: !!error };
}
```

Return `error: !!error` (boolean) to the consumer — don't expose the raw error object.

## Loading / error / empty states

Containers check `isLoading` first, then render empty state if no data:

```tsx
if (isLoading) return <div className="animate-pulse">...</div>;   // skeleton
if (!data?.length) return <EmptyState />;
return <DataList data={data} />;
```

Error states are handled via `sonner` toasts in the hook:

```ts
useEffect(() => {
  if (error) toast.error('Error al cargar datos');
}, [error]);
```

## Typing API responses

Types live in `src/types/{domain}/{type-name}.types.ts` or `src/types/{domain}/{type}.ts`.

Responses from `ApiServiceClient` are untyped at runtime (cast as `any` in many places). When adding a new endpoint:
1. Define the response type in `src/types/`
2. Pass it as the generic to `ApiServiceClient(url).get<MyType>('/endpoint')`
3. The hook returns the typed data

Do not use `any` in new code. If the API shape is uncertain, use `unknown` and narrow it.

## Forms

- Most forms use **Formik** + **Yup** validation
- Some newer forms use local `useState` + inline validation
- `react-hook-form` is installed but rarely used
- Form submissions always go through a mutation hook, never direct fetch calls from the component

## i18n

Translations are in `src/static/texts/es.json`. Access them via:
```ts
const { t } = useTranslation();
t('users.create.form.fullName')
```

Keys are also mapped in `src/static/texts/i18n.ts` as typed constants. Prefer the typed constant over raw string keys in new code.

## Rules for new code (and when touching existing code)

1. **All navigation** goes through `useNavigation()` — never call `router.push()` directly in a component.
2. **Auth guard on every private page** — every new page must export `getServerSideProps = authorizeServerSidePage()`.
3. **No hardcoded UUIDs or IDs** in service catalogs, type lists, or any data that should come from the API.
4. **Check API_CONTRACT.md** before consuming a new endpoint — if it's not listed there as implemented, it may not exist.
5. **No direct imports from `next/router`** in containers — import `useNavigation` instead.
6. **AppointmentStatus** is defined in three places (appointment types file, use-appointment-list-container, use-dashboard). Until consolidated, import from `src/types/appointments/appointment.ts`.
7. **No abbreviated variable names** — `appointment` not `app`, `rawResponse` not `raw`, `error` not `err`, `config` not `cfg`. Exception: `i` in trivial one-liner maps, `e` in event handlers with an explicit type annotation.
8. **No `any`** — define the response type in `src/types/` and pass it as a generic. Use `unknown` + narrowing if the shape is uncertain. Migrate `any` encountered in files being edited.
9. **`isLoading` not `loading`** — hooks always return `isLoading`. Files that alias it to `loading` (`use-appointment-list-container.ts`, `use-add-appointment.ts`) should be corrected when touched.
10. **Container naming: `{Feature}Container`** — always suffix with `Container`. Not `View`, `Screen`, or `Page`. Rename when touching a file that violates this.
11. **All user-visible strings via i18n** — use `t(TEXT.MODULE.KEY)` from `useTranslation()`. Add keys to `src/static/texts/es.json` and the typed `TEXT` constant in `src/static/texts/i18n.ts`. Migrate hardcoded strings in any file being edited.
12. **Verify after any rename** — after renaming a component, variable, or i18n key, confirm all imports compile and all `t('key')` calls have a matching entry in `es.json`.
13. **Enums para valores discretos — nunca string literals** — cualquier valor que tenga un conjunto finito de opciones (estados, tipos, modos, vías, roles) debe declararse como `enum` TypeScript, no como `type = 'a' | 'b'` ni strings hardcodeados. Esto aplica a código nuevo y a strings literales que se encuentren al tocar un archivo existente.
14. **No raw HTML text elements for UI copy** — never use `<p>`, `<span>`, `<h1-h6>`, or `<label>` with hardcoded text directly. Always use `<Typography variant={TypographyVariant.X}>` from `@/components/common/typography/typography`. Migrate any raw text elements found in files being edited. Exception: text inside Tailwind utility-only wrappers (e.g. a `<div>` used purely for layout) may keep a single `<Typography>` child without an extra wrapper.

## Boy Scout Rule — copy & typography

**When you touch any file for any reason**, also fix in that same file:
- Hardcoded Spanish strings → move to `es.json` + `i18n.ts`, replace with `t(TEXT.X.Y)`
- Raw `<p>`, `<span>`, `<h*>` with text → replace with `<Typography variant={TypographyVariant.X}>`

Do NOT open files solely to fix copy/typography — only fix what you're already touching. This keeps the cost near zero while progressively cleaning the codebase.
