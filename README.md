# Restock Console

An internal tool for a warehouse procurement team. The buyer using it has one job: see what
is running out and work out what restocking will cost. It is not a storefront — the layout is
built for information density and scanning speed, not for browsing.

- **Live demo:** _<add Vercel URL>_
- **Repository:** _<add repository URL>_

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, axios.

No UI library is used. Pagination, the category dropdown, stock badges, the image gallery and
the responsive table are all hand-written with Tailwind.

## Getting started

Node.js 20.9 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

No environment variables are needed — the DummyJSON API is public and requires no key.

## Project structure

```
src/
  lib/
    api/api.ts                 axios instance and one function per endpoint
    functions/functions.ts     pure helpers: URL building, sorting, formatting
    constants.ts               every literal: API config, page size, debounce delay,
                               stock statuses, sort options, shared class strings
  types/types.ts               every type in the project: API shapes, URL state, props
  app/                         routes, layout, providers, loading / error / not-found
    page.tsx                   server: reads searchParams, fetches, renders the list
    Products.client.tsx        client: toolbar, URL writing, list interactivity
    product/[id]/              server page + client detail view
  components/                  one folder per component, file named after the folder
    Header, Footer, SearchInput, CategorySelect, SortSelect,
    ProductsTable, Pagination, StockBadge, Reviews, Gallery
```

- `lib/` — everything that talks to the API, the shared pure helpers, and constants.
- `types/` — all types live here, including component props, so a shape is defined once.
- `app/` — routes. Each `page.tsx` is a server component; its `*.client.tsx` sibling handles
  interaction.
- `components/` — presentational and interactive pieces, none of which fetch data.

Components hold JSX and event wiring only. Anything pure — building a list URL, cycling the
sort state, computing the pagination window, averaging ratings, formatting a price or a
dimension — lives in `lib/functions/functions.ts`, where it can be read and tested without
rendering anything.

## Implementation notes

**The URL is the single source of truth for the list.** Search, category, sort and page live
in `?q=`, `?category=`, `?sort=` and `?page=`. Nothing mirrors them in React state. The server
component reads `searchParams`, fetches, and passes plain props down; `Products.client.tsx`
writes back to the URL. This is what makes reload restore the view, a pasted link reproduce it
for a colleague, and the Back button step through filter states. Because the params arrive as
props rather than through `useSearchParams`, no component needs a `Suspense` boundary to avoid
a client-side rendering bailout.

Defaults are omitted from the query string, so page 1 unfiltered is always `/` rather than
`/?q=&page=1`. One state, one URL.

**Search and category cannot be combined server-side.** DummyJSON exposes them as separate
endpoints. So: search alone uses `/products/search`, category alone uses
`/products/category/{slug}`, neither uses `/products`. When both are set, `api.ts` requests the
whole category (`limit=0`), filters by `title` case-insensitively, and paginates the filtered
array by hand. Because the API applies the sort before we filter, slicing the filtered array
still yields a correctly ordered page.

**`replace` vs `push`.** Debounced typing uses `router.replace`, so typing a word leaves one
history entry instead of one per keystroke — Back after a search returns to where the buyer
came from, not through `p`, `ph`, `pho`. Category changes, sort changes and pagination use
`push` or `<Link>`, because those are deliberate steps that should be reversible.

**Toolbar inputs are uncontrolled.** A controlled `<input value={q}>` would need a state mirror
of the URL, and a controlled `<select>` visibly snaps back to the old value while the
navigation is in flight — the `isPending` re-render forces the DOM back to the not-yet-updated
prop. Both inputs therefore use `defaultValue` plus a small effect that writes the DOM value
only when the URL changes to something the component did not just send. Typing is never
interrupted, and Back or a pasted link still updates the controls.

**Server components fetch, client components interact.** Every axios call lives in
`lib/api/api.ts` and runs on the server. Nothing fetches on the client, so there is no loading
waterfall to manage, no cache to invalidate, and no reason to add react-query — the data
lifecycle is the request lifecycle. Navigation is wrapped in `useTransition`, which dims the
table while the next page is fetched instead of tearing the mounted toolbar down.

**Average rating is computed from the `reviews` array.** The `rating` field returned by the API
is deliberately unused anywhere in the codebase. Items with no reviews render an explicit empty
state rather than `0` or `NaN`.

**The order is stored per product, not as a single total.** `localStorage` holds a
`{ productId: quantity }` map and the header counter is its sum. A bare number would be
cheaper, but it cannot answer the question the buyer's constraint depends on: how many of
*this* item are already on order. With the map, "Add to order" is blocked once the quantity on
order reaches the units in the warehouse — you cannot order 4 of an item with 3 in stock — and
out-of-stock items cannot be ordered at all. The button states why it is disabled rather than
just going grey.

A **Clear** button next to the header counter empties the order. It appears only when something
is on order, so it costs nothing in the default state. No order screen was built — the
assignment states none is needed — but without a reset there is no way to undo a miscount.

The map is shared through a context in `app/providers.tsx` and read with
`useSyncExternalStore`, which gives a correct server snapshot during rendering and the stored
value after hydration — no mismatch warning and no `setState` inside an effect. The snapshot is
memoised against the raw stored string, because `useSyncExternalStore` requires a stable
reference and parsing JSON on every call would return a new object and loop. As a side effect
the order also stays in sync across browser tabs.

**The category filter and the mobile sort control are native `<select>` elements**, styled with
Tailwind but not replaced. A hand-built listbox would allow a custom-styled dropdown, but a
native select brings type-ahead, arrow and Home/End navigation, Escape-to-close and the OS
picker on mobile for free — all of which a replacement would have to re-implement correctly.
For a keyboard-driven internal tool that trade is not worth making for cosmetics. The dropdown
list is drawn by the browser, so its scrollbar follows the operating system rather than the
palette; that is the visible cost of the decision.

**The list is a `ul` of rows laid out with CSS grid**, carrying `role="table"`, `role="row"`,
`role="columnheader"` and `role="cell"` so screen readers still announce it as tabular data.
The grid template is declared once and shared by the header row and the data rows, which keeps
the columns aligned and makes the responsive behaviour a single breakpoint switch: below `md`
the grid collapses and each cell prints its own label from a `data-label` attribute.

**Stock signalling never relies on colour alone.** `StockBadge` always carries text (`LOW`,
`OUT`) next to the tinted row, so the signal survives greyscale printing and colour-blindness.

## Data observations

Three things about the live API differ from the assignment brief. Each is handled rather than
assumed away:

- **`availabilityStatus` has a third value.** Beyond `In Stock` and `Low Stock`, the catalogue
  also contains `Out of Stock`. It is modelled as a union type; out-of-stock rows are greyed
  and carry an `OUT` badge, distinct from the yellow `LOW` treatment. The toolbar counter is
  labelled "running out on this page" and counts only `Low Stock`, so it is never confused with
  out-of-stock.
- **Roughly half the products have no `brand` field.** It is typed optional and rendered as `—`
  in the table and on the product page. `undefined` is never rendered.
- **`/products/categories` returns objects, not strings** (`{ slug, name, url }`). The `slug` is
  the option value and what travels in the URL; the `name` is the label, and the same map turns
  a product's category slug into a readable name in the table.

- **Every review in the dataset carries the same timestamp** — `2025-04-30T09:41:02.053Z`,
  identical to the millisecond across all products. A plain date comparison therefore returns
  zero for every pair and the newest / oldest toggle would do nothing at all. `sortReviews`
  sorts on the date and breaks ties on the order the supplier returned the reviews in, then
  derives "oldest first" as the exact inverse of "newest first". Against real data with
  distinct timestamps the date is still what drives the order.

Also worth knowing: `Low Stock` covers only about 7% of the catalogue, so the toolbar counter
legitimately reads 0 on most pages. Filter to a category such as *groceries* to see the
highlighting.

## Requirements checklist

**Screen 1 — Working list**

- [x] Table of products, not a grid of cards
- [x] Columns: thumbnail, name with SKU underneath, brand, category, unit price, stock
- [x] Search by name, debounced (350 ms)
- [x] Category filter populated from the API
- [x] Pagination, 30 items per page
- [x] Search, category and page live in the URL and survive reload, sharing and Back
- [x] Low-stock rows visually marked with a short marker next to the stock figure
- [x] Toolbar counter of items running out on the current page
- [x] Empty state when a search or category returns nothing

**Screen 2 — Product page**

- [x] Separate `/product/:id` route fed by `GET /products/{id}`
- [x] Image, name, brand, SKU, description, price
- [x] Stock level with the same low-stock marker
- [x] Logistics block: weight, dimensions, shipping, return policy, warranty
- [x] Reviews with an average rating computed from `reviews`; the API `rating` field unused
- [x] Zero-review case handled explicitly
- [x] Review order toggle, newest first / oldest first
- [x] "Add to order" increments a header counter that survives reload, capped at the units in
      stock and disabled entirely for out-of-stock items
- [x] Returning to the list preserves filters and page

**Technical**

- [x] No UI libraries; all styling hand-written with Tailwind
- [x] Typed API layer, no `any`
- [x] Loading, error and empty states
- [x] Deploys to Vercel with no config changes

**Optional**

- [x] Sorting by price and by stock, also URL-driven
- [x] Image gallery on the product page
- [x] Mobile layout

## Known limitations

- **Combined search and category is filtered client-side of the API.** The whole category is
  fetched and filtered in `api.ts`. Categories here hold at most a few dozen items, so this is
  cheap; against a real catalogue it would need a server-side endpoint that accepts both.
- **Search matches `title` only** when a category is also selected, whereas
  `/products/search` alone also matches description and brand. The two paths are therefore not
  perfectly equivalent.
- **The product page fetches twice per request** — once in `generateMetadata` and once in the
  page body. axios does not participate in the Next.js fetch cache and no caching layer was
  added, by design.
- **The category list is fetched before the products**, not in parallel, because an unknown
  slug in the URL has to be rejected before the product request is built. It costs one extra
  round trip on the list route.
- **On narrow screens the thumbnail column is dropped.** Rows become stacked, labelled blocks
  and the sort control moves from the column headers into a select in the toolbar. Scanning on
  mobile is by name and SKU.
- **No tests.** Nothing was specified, and the assignment is scoped to the two screens.
