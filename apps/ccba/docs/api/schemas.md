# API Schemas

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Authentication Schemas

### Token
```typescript
interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
```

### User
```typescript
interface User {
  user_id: string;
  email: string;
  name: string;
  client_id: string;
  is_admin?: boolean;
}
```

### LoginRequest
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

---

## Client & Brand Schemas

### Client
```typescript
interface Client {
  company_name: string;
  contact_email: string;
  phone_number?: string;
  client_id: string;
}
```

### Brand
```typescript
interface Brand {
  client_id: string;
  name: string;
  url: string;
  pathway?: "A" | "B";
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  brand_id: string;
  created_at?: string;
}
```

### Competitor
```typescript
interface Competitor {
  name: string;
  url: string;
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  competitor_id?: string;
}
```

---

## Scraping Schemas

### BatchScrapeRequest (Website)
```typescript
interface BatchScrapeRequest {
  client_id: string;
  brand_id: string;
  limit?: number; // default: 100
  name?: string;
}
```

### BatchSocialScrapeRequest
```typescript
interface BatchSocialScrapeRequest {
  client_id: string;
  brand_id: string;
  name?: string;
  start_date?: string;
  end_date?: string;
}
```

### ScrapeRequest (Playwright Website)
```typescript
interface ScrapeRequest {
  urls?: string[];
  file_path?: string;
  sitemap_url?: string;
  filter_keywords?: string[];
  limit?: number; // default: 1
  concurrency?: number; // default: 2
  page_load_timeout?: number; // default: 5000
  mk?: boolean; // default: true
  html_flag?: boolean; // default: false
  meta_flag?: boolean; // default: false
  headless?: boolean; // default: true
  clean?: boolean; // default: false
  get_images?: boolean; // default: false
  images_xpath?: string;
}
```

### FacebookScrapeRequest
```typescript
interface FacebookScrapeRequest {
  client_id: string;
  brand_id: string;
  target_urls: Array<{
    url: string;
    is_competitor?: boolean;
    competitor_id?: string;
  }>;
  results_limit?: number;
  only_posts_newer_than?: string;
  only_posts_older_than?: string;
}
```

### InstagramScraperRequest
```typescript
interface InstagramScraperRequest {
  url: string;
  username: string;
  password: string;
  client_id: string;
  brand_id: string;
  start_date: string;
  end_date: string;
  is_competitor?: boolean;
  competitor_id?: string;
  headless?: boolean;
  use_old_cookies?: boolean;
  cookies_path?: string;
  save_new_cookies?: boolean;
}
```

### YouTubeScraperRequest
```typescript
interface YouTubeScraperRequest {
  channal_url: string;
  concurrency?: number;
  transcription?: boolean;
  headless?: boolean;
}
```

### XScraperRequest
```typescript
interface XScraperRequest {
  email: string;
  password: string;
  profile_url: string;
  start_date: string;
  end_date: string;
  cookies_path?: string;
  headless?: boolean;
  max_tasks?: number;
}
```

### LinkedInScraperRequest
```typescript
interface LinkedInScraperRequest {
  email: string;
  password: string;
  profile_url: string;
  end_date: string;
  cookies_path?: string;
  headless?: boolean;
  max_tasks?: number;
}
```

---

## Validation Schemas

### ValidationError
```typescript
interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
```

### HTTPValidationError
```typescript
interface HTTPValidationError {
  detail: ValidationError[];
}
```

---

[← Back to Documentation Index](./index.md)
